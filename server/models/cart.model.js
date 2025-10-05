import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
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
    size: {
      type: String,
      default: "medium",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
