import { Inventory } from "../models/inventory.model.js";
import mongoose from "mongoose";


const initializeInventory = async () => {
  const defaultItems = [
    // Pizza Bases
    { name: "Thin Crust", category: "base", currentStock: 100, threshold: 20 },
    { name: "Thick Crust", category: "base", currentStock: 80, threshold: 15 },
    {
      name: "Stuffed Crust",
      category: "base",
      currentStock: 60,
      threshold: 10,
    },

    // Sauces
    {
      name: "Tomato Sauce",
      category: "sauce",
      currentStock: 50,
      threshold: 10,
    },
    { name: "White Sauce", category: "sauce", currentStock: 40, threshold: 8 },
    { name: "BBQ Sauce", category: "sauce", currentStock: 30, threshold: 5 },

    // Cheeses
    {
      name: "Mozzarella",
      category: "cheese",
      currentStock: 200,
      threshold: 50,
    },
    { name: "Cheddar", category: "cheese", currentStock: 150, threshold: 30 },
    { name: "Parmesan", category: "cheese", currentStock: 100, threshold: 20 },

    // Veggies
    { name: "Mushrooms", category: "veggie", currentStock: 80, threshold: 15 },
    {
      name: "Bell Peppers",
      category: "veggie",
      currentStock: 70,
      threshold: 12,
    },
    { name: "Red Onions", category: "veggie", currentStock: 60, threshold: 10 },
    { name: "Pepperoni", category: "veggie", currentStock: 90, threshold: 20 },
  ];

  for (const item of defaultItems) {
    await Inventory.findOneAndUpdate({ name: item.name }, item, {
      upsert: true,
      new: true,
    });
  }
};

(async () => {
  try {
    await mongoose.connect("process.env.MONGODB_URI", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB ✅");
    await initializeInventory();
    console.log("Inventory initialized ✅");
  } catch (err) {
    console.error("Error initializing inventory ❌", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

// 3. Update Stock After Order



