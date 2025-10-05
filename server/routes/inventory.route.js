import express from "express";
import { Inventory } from "../models/inventory.model.js";
import { sendSimpleLowStockAlert } from "../utils/email.js";
export const router = express.Router();

export const updateInventoryAfterOrder = async (orderItems) => {
  const lowStockAlerts = [];

  for (const item of orderItems) {
    // Deduct base
    if (item.crust) {
      const baseItem = await Inventory.findOneAndUpdate(
        { name: item.crust, category: "base" },
        { $inc: { currentStock: -1 }, lastUpdated: new Date() },
        { new: true }
      );
      if (baseItem && baseItem.currentStock <= baseItem.threshold) {
        lowStockAlerts.push(baseItem);
      }
    }

    // Deduct sauce
    if (item.sauce) {
      const sauceItem = await Inventory.findOneAndUpdate(
        { name: item.sauce, category: "sauce" },
        { $inc: { currentStock: -1 }, lastUpdated: new Date() },
        { new: true }
      );
      if (sauceItem && sauceItem.currentStock <= sauceItem.threshold) {
        lowStockAlerts.push(sauceItem);
      }
    }

    // Deduct cheeses
    if (item.cheeses && item.cheeses.length > 0) {
      for (const cheese of item.cheeses) {
        const cheeseItem = await Inventory.findOneAndUpdate(
          { name: cheese, category: "cheese" },
          { $inc: { currentStock: -1 }, lastUpdated: new Date() },
          { new: true }
        );
        if (cheeseItem && cheeseItem.currentStock <= cheeseItem.threshold) {
          lowStockAlerts.push(cheeseItem);
        }
      }
    }

    // Deduct toppings/veggies
    if (item.toppings && item.toppings.length > 0) {
      for (const topping of item.toppings) {
        const veggieItem = await Inventory.findOneAndUpdate(
          { name: topping, category: "veggie" },
          { $inc: { currentStock: -1 }, lastUpdated: new Date() },
          { new: true }
        );
        if (veggieItem && veggieItem.currentStock <= veggieItem.threshold) {
          lowStockAlerts.push(veggieItem);
        }
      }
    }
  }

  // Send email alerts if any item is low
  if (lowStockAlerts.length > 0) {
    await sendLowStockAlert(req.user.email, lowStockAlerts);
  }

  return lowStockAlerts;
};

const sendLowStockAlert = async (lowStockItems) => {
  const itemsList = lowStockItems
    .map(
      (item) =>
        `• ${item.name}: ${item.currentStock} ${item.unit} (Threshold: ${item.threshold})`
    )
    .join("\n");

  try {
    await sendSimpleLowStockAlert(process.env.ADMIN_EMAIL, itemsList);
    console.log("Low stock alert email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Get all inventory
router.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// Update inventory manually
router.put("/inventory/:id", async (req, res) => {
  try {
    const { currentStock, threshold } = req.body;
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { currentStock, threshold, lastUpdated: new Date() },
      { new: true }
    );
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update inventory" });
  }
});

// Add new inventory item
router.post("/inventory", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add inventory item" });
  }
});

// Modify your existing order completion route
router.post("/orders/complete", async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get order details (assuming you have order in your DB)
    const order = await Order.findById(orderId);

    // Update inventory
    const lowStockAlerts = await updateInventoryAfterOrder(order.items);

    // Mark order as completed
    order.status = "completed";
    await order.save();

    res.json({
      message: "Order completed successfully",
      lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete order" });
  }
});
