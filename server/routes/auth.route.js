import express from "express";

import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  protectRoute,
} from "../controllers/auth.controller.js";

import { getUser } from "../controllers/user.controller.js";

export const router = express.Router();
// Public routes
router.route("/signup").post(signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this point
router.use(protectRoute);

// Protected routes
router.get("/me", getUser);
// router.patch("/updateMyPassword", updatePassword);
// router.patch("/updateMe", updateMe);
// router.delete("/deleteMe", deleteMe);

export default router;
