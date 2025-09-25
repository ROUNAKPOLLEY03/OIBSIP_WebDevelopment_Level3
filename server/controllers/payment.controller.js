import crypto from "crypto";
import { razorpay } from "../config/razorpay.js";
import { Cart } from "../models/cart.model.js";
import { PizzaOrder } from "../models/pizzaOrder.model.js";

// Helper: compute total from cart items
const computeTotal = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);
};

// 1️⃣ Create Razorpay order based on cart total
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId });
    const { amount } = req.body;

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, // ✅ keep under 40 chars
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderData: order,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

// 2️⃣ Verify Razorpay payment (demo version using only payment_id)
export const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { razorpay_payment_id } = req.body;


    if (!razorpay_payment_id) {
      return res.status(400).json({ message: "Missing payment id" });
    }

    // Fetch cart
    const cartItems = await Cart.find({ userId });
    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart empty" });
    }

    // Convert cart items into PizzaOrder docs
    const pizzaDocs = cartItems.map((item) => ({
      userId,
      crust: item.crust,
      sauce: item.sauce,
      cheeses: item.cheeses || [],
      toppings: item.toppings || [],
      size: item.size,
      quantity: item.quantity || 1,
      totalPrice: (item.price || 0) * (item.quantity || 1),
      status: "preparing", // directly preparing after "payment"
      payment: {
        razorpay_payment_id, // ✅ only save payment id
        verifiedWithoutSignature: true, // mark for clarity
      },
    }));

    // Save pizzas as successful orders
    const savedOrders = await PizzaOrder.insertMany(pizzaDocs);

    // Clear cart
    await Cart.deleteMany({ userId });

    return res.json({
      success: true,
      message: "Payment recorded (without signature verification)",
      orders: savedOrders,
    });
  } catch (error) {
    console.error("verifyPaymentAndPlaceOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
