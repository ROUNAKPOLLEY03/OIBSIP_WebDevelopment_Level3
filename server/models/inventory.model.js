import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["base", "sauce", "cheese", "veggie"],
    required: true,
  },
  currentStock: { type: Number, default: 0 },
  threshold: { type: Number, default: 20 }, // Alert when below this
  unit: { type: String, default: "pieces" },
  lastUpdated: { type: Date, default: Date.now },
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
