import { Cart } from "../models/cart.model.js";

// Add pizza to cart
export const addToCart = async (req, res) => {
  try {
    const { name, crust, sauce, cheeses, toppings, size } = req.body;
    if (!crust || !sauce) {
      return res
        .status(400)
        .json({ message: "Crust, sauce, and size are required" });
    }

    const cartItem = new Cart({
      userId: req.user._id,
      name: name ? name : "",
      crust: crust.name || crust,
      sauce: sauce.name || sauce,
      cheeses: cheeses.map((c) => c.name || c),
      toppings: toppings.map((t) => t.name || t),
      size: size?.name || size,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// Get all cart items for a user
export const getCartByUser = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    res.json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Remove single item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};
