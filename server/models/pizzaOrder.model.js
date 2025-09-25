// models/PizzaOrder.js
import mongoose from "mongoose";

const pizzaOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    crust: {
      type: String,
      required: true,
    },
    sauce: {
      type: String,
      required: true,
    },
    cheeses: [
      {
        type: String,
      },
    ],
    toppings: [
      {
        type: String,
      },
    ],
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature: { type: String },
      method: { type: String },
      paid_at: { type: Date },
    },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export const PizzaOrder = mongoose.model("PizzaOrder", pizzaOrderSchema);
