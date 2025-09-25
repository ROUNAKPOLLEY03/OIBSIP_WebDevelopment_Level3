import express from "express";
import {
  createPaymentOrder,
  verifyPaymentAndPlaceOrder,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../controllers/auth.controller.js";

export const router = express.Router();

// Create Razorpay order (calculates total server-side from cart)
router.post("/create-order", protectRoute, createPaymentOrder);

// Verify payment signature AND on success create Pizza docs + Order doc + clear Cart
router.post("/verify-payment", protectRoute, verifyPaymentAndPlaceOrder);


