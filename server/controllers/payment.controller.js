import { razorpay } from "../config/razorpay.js";
import { Cart } from "../models/cart.model.js";
import { PizzaOrder } from "../models/pizzaOrder.model.js";
import { updateInventoryAfterOrder } from "../routes/inventory.route.js";

// Pizza price calculation logic
const calculatePizzaPrice = (item) => {
  let basePrice = 0;

  // Base price by size
  switch (item.size) {
    case 'Small (8")':
      basePrice = 199;
      break;
    case 'Medium (12")':
      basePrice = 299;
      break;
    case 'Large (16")':
      basePrice = 399;
      break;
    default:
      basePrice = 299;
  }

  // Add topping costs (₹30 per topping)
  const toppingCost = (item.toppings?.length || 0) * 30;

  // Add cheese cost if premium cheese
  const cheeseCost =
    item.cheeses?.includes("Cheddar") || item.cheeses?.includes("Parmesan")
      ? 50
      : 0;

  return basePrice + toppingCost + cheeseCost;
};

// Helper: compute total from cart items using the price calculation
const computeTotal = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    const calculatedPrice = calculatePizzaPrice(item);
    const qty = item.quantity || 1;
    return sum + calculatedPrice * qty;
  }, 0);
};

// 1️⃣ Create Razorpay order based on cart total
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total using the price calculation logic
    const totalAmount = computeTotal(cartItems);

    console.log("Cart items:", cartItems);
    console.log("Calculated total:", totalAmount);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid cart total" });
    }

    const options = {
      amount: totalAmount * 100, // paise (multiply by 100 for Razorpay)
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
      calculatedTotal: totalAmount, // Send calculated total for debugging
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

// 2️⃣ Verify Razorpay payment and place order
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

    // Convert cart items into PizzaOrder docs with calculated prices
    const pizzaDocs = cartItems.map((item) => {
      const calculatedPrice = calculatePizzaPrice(item);
      const quantity = item.quantity || 1;
      const totalPrice = calculatedPrice * quantity;

      console.log(
        `Pizza: ${item.size}, Base: ${calculatedPrice}, Qty: ${quantity}, Total: ${totalPrice}`
      );

      return {
        userId,
        crust: item.crust,
        sauce: item.sauce,
        cheeses: item.cheeses || [],
        toppings: item.toppings || [],
        size: item.size,
        quantity: quantity,
        unitPrice: calculatedPrice, // Store unit price for reference
        totalPrice: totalPrice, // This will now have the correct calculated value
        status: "preparing", // directly preparing after "payment"
        payment: {
          razorpay_payment_id, // ✅ only save payment id
          verifiedWithoutSignature: true, // mark for clarity
        },
        createdAt: new Date(),
      };
    });

    console.log("Pizza docs to save:", pizzaDocs);

    // Save pizzas as successful orders
    const savedOrders = await PizzaOrder.insertMany(pizzaDocs);

    // Clear cart
    await Cart.deleteMany({ userId });

    const lowStockAlerts = await updateInventoryAfterOrder(pizzaDocs);

    // Calculate grand total for response
    const grandTotal = pizzaDocs.reduce(
      (sum, pizza) => sum + pizza.totalPrice,
      0
    );

    return res.json({
      success: true,
      message: "Payment recorded and orders placed successfully",
      orders: savedOrders,
      grandTotal: grandTotal,
      orderCount: savedOrders.length,
      lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : null,
    });
  } catch (error) {
    console.error("verifyPaymentAndPlaceOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
