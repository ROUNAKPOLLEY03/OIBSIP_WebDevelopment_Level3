import { PizzaOrder } from "../models/pizzaOrder.model.js";
import { PIZZA_DATA } from "../data/data.js";

// Helper function to calculate pizza price
const calculatePizzaPrice = (
  crust,
  sauce,
  cheeses,
  toppings,
  size = "medium"
) => {
  const basePrice = PIZZA_DATA.bases.find((b) => b.id === crust)?.price || 199;
  const saucePrice = PIZZA_DATA.sauces.find((s) => s.id === sauce)?.price || 0;
  const cheesePrice = cheeses.reduce((total, cheese) => {
    const cheeseData = PIZZA_DATA.cheeses.find((c) => c.id === cheese);
    return total + (cheeseData?.price || 0);
  }, 0);
  const toppingsPrice = toppings.reduce((total, topping) => {
    const toppingData = PIZZA_DATA.toppings.find((t) => t.id === topping);
    return total + (toppingData?.price || 0);
  }, 0);

  const sizeMultiplier =
    PIZZA_DATA.sizes.find((s) => s.id === size)?.multiplier || 1.3;
  const totalPrice =
    (basePrice + saucePrice + cheesePrice + toppingsPrice) * sizeMultiplier;

  return Math.round(totalPrice);
};

// Get all pizza ingredients
export const getPizzaIngredients = async (req, res) => {
  try {
    res.json({
      success: true,
      data: PIZZA_DATA,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pizza ingredients",
      error: error.message,
    });
  }
};

// Create a new pizza order
export const createPizzaOrder = async (req, res) => {
  try {
    const {
      crust,
      sauce,
      cheeses,
      toppings,
      quantity = 1,
      size = "medium",
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!crust || !sauce) {
      return res.status(400).json({
        success: false,
        message: "Crust and sauce are required",
      });
    }

    // Calculate total price
    const unitPrice = calculatePizzaPrice(
      crust,
      sauce,
      cheeses || [],
      toppings || [],
      size
    );
    const totalPrice = unitPrice * quantity;

    // Create pizza order
    const pizzaOrder = new PizzaOrder({
      userId,
      crust,
      sauce,
      cheeses: cheeses || [],
      toppings: toppings || [],
      quantity,
      totalPrice,
    });

    const savedOrder = await pizzaOrder.save();

    res.status(201).json({
      success: true,
      message: "Pizza order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create pizza order",
      error: error.message,
    });
  }
};

// Get user's pizza orders
export const getUserPizzaOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await PizzaOrder.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get single pizza order
export const getPizzaOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await PizzaOrder.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pizza order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update pizza order status (for admin/kitchen)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await PizzaOrder.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Calculate pizza price (utility endpoint)
export const calculatePrice = async (req, res) => {
  try {
    const { crust, sauce, cheeses, toppings, size = "medium" } = req.body;

    const price = calculatePizzaPrice(
      crust,
      sauce,
      cheeses || [],
      toppings || [],
      size
    );

    res.json({
      success: true,
      data: {
        price,
        breakdown: {
          base: PIZZA_DATA.bases.find((b) => b.id === crust)?.price || 199,
          sauce: PIZZA_DATA.sauces.find((s) => s.id === sauce)?.price || 0,
          cheeses: (cheeses || []).map((cheese) => ({
            name: cheese,
            price: PIZZA_DATA.cheeses.find((c) => c.id === cheese)?.price || 0,
          })),
          toppings: (toppings || []).map((topping) => ({
            name: topping,
            price:
              PIZZA_DATA.toppings.find((t) => t.id === topping)?.price || 0,
          })),
          sizeMultiplier:
            PIZZA_DATA.sizes.find((s) => s.id === size)?.multiplier || 1.3,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate price",
      error: error.message,
    });
  }
};
