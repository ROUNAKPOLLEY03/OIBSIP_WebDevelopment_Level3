import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { router as authRouter } from "./routes/auth.route.js";
import { router as pizzaRouter } from "./routes/pizza.route.js";
import { router as cartRouter } from "./routes/cart.route.js";
import { router as paymentRouter } from "./routes/payment.route.js";
import { router as adminRouter } from "./routes/admin.route.js";
import { router as inventoryRouter } from "./routes/inventory.route.js";

const app = express();
dotenv.config();

//Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both React dev servers
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

//Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Pizza App Backend is Running!",
    timestamp: new Date(),
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

//Backend
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/pizza", pizzaRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", inventoryRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
