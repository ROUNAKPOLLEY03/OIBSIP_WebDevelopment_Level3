// utils/priceCalculator.js
// Centralized price calculation logic - use this everywhere!

/**
 * Calculate the price of a single pizza based on size, toppings, and cheese
 * @param {Object} pizzaItem - Pizza configuration object
 * @param {string} pizzaItem.size - Pizza size (e.g., 'Small (8")', 'Medium (12")', 'Large (16")')
 * @param {Array} pizzaItem.toppings - Array of topping names
 * @param {Array} pizzaItem.cheeses - Array of cheese names
 * @returns {number} - Total price for the pizza
 */
export const calculatePizzaPrice = (pizzaItem) => {
  let basePrice = 0;

  // Base price by size
  switch (pizzaItem.size) {
    case 'Small (8")':
      basePrice = 199;
      break;
    case 'Medium (12")':
      basePrice = 299;
      break;
    case 'Large (16")':
      basePrice = 399;
      break;
    default:
      basePrice = 299; // Default to medium
  }

  // Add topping costs (₹30 per topping)
  const toppingCost = (pizzaItem.toppings?.length || 0) * 30;

  // Add premium cheese cost (₹50 for Cheddar or Parmesan)
  const premiumCheeses = ["Cheddar", "Parmesan"];
  const hasPremiumCheese = pizzaItem.cheeses?.some((cheese) =>
    premiumCheeses.includes(cheese)
  );
  const cheeseCost = hasPremiumCheese ? 50 : 0;

  const totalPrice = basePrice + toppingCost + cheeseCost;

  return totalPrice;
};

/**
 * Calculate total price for multiple pizza items with quantities
 * @param {Array} cartItems - Array of cart items
 * @returns {number} - Total price for all items
 */
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const itemPrice = calculatePizzaPrice(item);
    const quantity = item.quantity || 1;
    return total + itemPrice * quantity;
  }, 0);
};

/**
 * Calculate order summary with tax and delivery
 * @param {Array} cartItems - Array of cart items
 * @param {number} discount - Discount amount (optional)
 * @returns {Object} - Complete order breakdown
 */
export const calculateOrderSummary = (cartItems, discount = 0) => {
  const subtotal = calculateCartTotal(cartItems);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery above ₹500
  const total = subtotal + tax + deliveryFee - discount;

  return {
    subtotal,
    tax,
    deliveryFee,
    discount,
    total: Math.max(0, total), // Ensure total doesn't go negative
    itemCount: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
  };
};

/**
 * Get price breakdown for a single pizza (for display purposes)
 * @param {Object} pizzaItem - Pizza configuration
 * @returns {Object} - Detailed price breakdown
 */
export const getPizzaPriceBreakdown = (pizzaItem) => {
  let basePrice = 0;

  switch (pizzaItem.size) {
    case 'Small (8")':
      basePrice = 199;
      break;
    case 'Medium (12")':
      basePrice = 299;
      break;
    case 'Large (16")':
      basePrice = 399;
      break;
    default:
      basePrice = 299;
  }

  const toppingCount = pizzaItem.toppings?.length || 0;
  const toppingCost = toppingCount * 30;

  const premiumCheeses = ["Cheddar", "Parmesan"];
  const hasPremiumCheese = pizzaItem.cheeses?.some((cheese) =>
    premiumCheeses.includes(cheese)
  );
  const cheeseCost = hasPremiumCheese ? 50 : 0;

  return {
    basePrice,
    toppings: {
      count: toppingCount,
      cost: toppingCost,
      list: pizzaItem.toppings || [],
    },
    cheese: {
      isPremium: hasPremiumCheese,
      cost: cheeseCost,
      list: pizzaItem.cheeses || [],
    },
    total: basePrice + toppingCost + cheeseCost,
  };
};

// Price constants for easy reference
export const PRICE_CONFIG = {
  SIZES: {
    'Small (8")': 199,
    'Medium (12")': 299,
    'Large (16")': 399,
  },
  TOPPING_COST: 30,
  PREMIUM_CHEESE_COST: 50,
  PREMIUM_CHEESES: ["Cheddar", "Parmesan"],
  TAX_RATE: 0.05,
  FREE_DELIVERY_THRESHOLD: 500,
  DELIVERY_FEE: 40,
};
