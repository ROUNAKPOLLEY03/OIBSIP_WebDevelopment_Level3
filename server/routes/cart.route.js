import express from "express";
import {
  addToCart,
  removeFromCart,
  clearCart,
  getCartByUser,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../controllers/auth.controller.js";

export const router = express.Router();

router.post("/", protectRoute, addToCart);
router.get("/", protectRoute, getCartByUser);
router.delete("/:id", protectRoute, removeFromCart);
router.delete("/", protectRoute, clearCart);
