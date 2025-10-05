// routes/admin.js
import express from "express";
import { PizzaOrder } from "../models/pizzaOrder.model.js";
import { protectRoute } from "../controllers/auth.controller.js";

export const router = express.Router();

// Admin middleware - checks if user is admin
const adminAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({
      message: "Server error during admin authentication",
      error: error.message,
    });
  }
};

// Get all orders (Admin only)
router.get("/orders", protectRoute, adminAuth, async (req, res) => {
  try {
    const orders = await PizzaOrder.find()
      .populate("userId", "name email") // Populate user details
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Update order status (Admin only)
router.patch("/orders/:orderId/status", protectRoute, adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "preparing", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be one of: pending, preparing, delivered, cancelled",
      });
    }

    // Find and update the order
    const order = await PizzaOrder.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
        customer: order.userId.name,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);

    // Handle specific MongoDB errors
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid order ID format",
      });
    }

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// Get order statistics (Admin only)
router.get("/stats", protectRoute, adminAuth, async (req, res) => {
  try {
    const stats = await PizzaOrder.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Format the stats
    const formattedStats = {
      pending: { count: 0, revenue: 0 },
      preparing: { count: 0, revenue: 0 },
      delivered: { count: 0, revenue: 0 },
      cancelled: { count: 0, revenue: 0 },
    };

    stats.forEach((stat) => {
      if (formattedStats[stat._id]) {
        formattedStats[stat._id] = {
          count: stat.count,
          revenue: stat.totalRevenue,
        };
      }
    });

    // Calculate totals
    const totalOrders = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalRevenue = stats.reduce(
      (sum, stat) => sum + stat.totalRevenue,
      0
    );

    res.json({
      statusStats: formattedStats,
      totals: {
        orders: totalOrders,
        revenue: totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

// Get single order details (Admin only)
router.get("/orders/:orderId", protectRoute, adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await PizzaOrder.findById(orderId).populate(
      "userId",
      "name email phone"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order details error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid order ID format",
      });
    }

    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
});


