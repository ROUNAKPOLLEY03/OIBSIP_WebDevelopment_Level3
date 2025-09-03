import express from "express";
import { protectRoute } from "../controllers/auth.controller.js";

import {
  getPizzaIngredients,
  createPizzaOrder,
  getUserPizzaOrders,
  getPizzaOrder,
  updateOrderStatus,
  calculatePrice,
} from "../controllers/pizza.controller.js";

export const router = express.Router();

// Public routes
router.get("/ingredients", getPizzaIngredients);
router.post("/calculate-price", calculatePrice);

// Protected routes (require authentication)
router.use(protectRoute);
router.post("/order", createPizzaOrder);
router.get("/orders", getUserPizzaOrders);
router.get("/orders/:orderId", getPizzaOrder);

// Admin routes (you can add admin middleware later)
router.put("/orders/:orderId/status", updateOrderStatus);
