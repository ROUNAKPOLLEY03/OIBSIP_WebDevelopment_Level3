import React, { useState, useEffect } from "react";
import { cartAPI } from "../utils/api";
import { paymentAPI } from "../utils/api";
import { SuccessPopup, ErrorPopup } from "./Popup";

const Cart = () => {
  const [popup, setPopup] = useState({ type: null, message: "" });
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart data on component mount
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setIsCartLoading(true);
      setError(null);
      const response = await cartAPI.getCart();

      // Transform API data to match component structure
      const transformedItems = response.map((item) => ({
        id: item._id,
        name: `Custom ${item.size} Pizza`,
        base: item.crust,
        sauce: item.sauce,
        cheeses: item.cheeses,
        toppings: item.toppings,
        size: item.size,
        price: calculatePizzaPrice(item),
        quantity: 1, // Assuming each item is quantity 1, adjust if your API stores quantity
        image: getPizzaEmoji(item.toppings),
        userId: item.userId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      setCartItems(transformedItems);
    } catch (error) {
      console.error("Error loading cart:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setIsCartLoading(false);
    }
  };

  // Calculate pizza price based on size and toppings
  const calculatePizzaPrice = (item) => {
    let basePrice = 0;

    // Base price by size
    switch (item.size) {
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

    // Add topping costs (₹30 per topping)
    const toppingCost = item.toppings.length * 30;

    // Add cheese cost if premium cheese
    const cheeseCost =
      item.cheeses.includes("Cheddar") || item.cheeses.includes("Parmesan")
        ? 50
        : 0;

    return basePrice + toppingCost + cheeseCost;
  };

  // Get appropriate emoji based on toppings
  const getPizzaEmoji = (toppings) => {
    if (toppings.includes("Pepperoni")) return "🍕";
    if (toppings.includes("Mushrooms")) return "🍄";
    if (toppings.includes("Bell Peppers")) return "🫑";
    if (toppings.includes("Red Onions")) return "🧅";
    return "🍕";
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery above ₹500
  const total = subtotal + tax + deliveryFee - discount;

  // Update quantity (local state only - you might want to add API call)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      setIsLoading(true);
      await cartAPI.removeFromCart(id);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartAPI.clearCart();
      setCartItems([]);
      alert("🗑️ Cart cleared successfully!");
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (promoCode.toLowerCase() === "welcome10") {
        setDiscount(Math.round(subtotal * 0.1)); // 10% off
        alert("🎉 Promo code applied! 10% discount added.");
      } else if (promoCode.toLowerCase() === "first50") {
        setDiscount(50);
        alert("🎉 Promo code applied! ₹50 discount added.");
      } else {
        alert("❌ Invalid promo code. Try: WELCOME10 or FIRST50");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePayment = async () => {
    try {
      const order = await paymentAPI.createOrder(total);

      const options = {
        key: "rzp_test_RDxTmdKhfaf6UV",
        amount: order.amount,
        currency: order.currency,
        name: "Pizza App",
        description: "Pizza Order",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await paymentAPI.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
          });

          if (verifyRes.success) {
            setPopup({
              type: "success",
              message: "Payment successful! Your pizzas are on the way 🍕🚀",
            });
            setCartItems([]);
          } else {
            setPopup({
              type: "error",
              message: "Payment verification failed ❌",
            });
          }
        },
        prefill: {
          name: "Pizza Lover",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setPopup({
          type: "error",
          message: "Payment failed ❌ Please try again.",
        });
      });
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      setPopup({ type: "error", message: "Could not initiate payment ⚠️" });
    }
  };
  // Loading state
  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-6">🍕</div>
            <h1 className="text-2xl font-semibold text-gray-700">
              Loading your delicious cart...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadCartData}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any pizzas yet. Let's fix that!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.history.back()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
              >
                🍕 Build a Pizza
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                🏠 Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛒 Your Cart ({cartItems.length} items)
            </h1>
            <p className="text-gray-600">
              Review your delicious pizza selections before checkout
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
                    <div className="animate-spin text-2xl">⏳</div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Pizza Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full border-4 border-yellow-400 flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>
                        <strong>Base:</strong> {item.base}
                      </p>
                      <p>
                        <strong>Sauce:</strong> {item.sauce}
                      </p>
                      <p>
                        <strong>Cheese:</strong>{" "}
                        {item.cheeses.join(", ") || "None"}
                      </p>
                      <p>
                        <strong>Toppings:</strong>{" "}
                        {item.toppings.join(", ") || "None"}
                      </p>
                      <p>
                        <strong>Size:</strong> {item.size}
                      </p>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isLoading}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                            className="w-8 h-8 bg-orange-200 hover:bg-orange-300 rounded-full flex items-center justify-center font-bold disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          ₹{item.price} each
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="text-center pt-4">
              <button
                onClick={() => window.history.back()}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-2"
              >
                ← Continue Building Pizzas
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={isLoading || !promoCode.trim()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? "..." : "Apply"}
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Try: WELCOME10, FIRST50
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span>
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    {deliveryFee === 0 && (
                      <span className="text-green-600 text-xs">(Free!)</span>
                    )}
                  </span>
                  <span
                    className={
                      deliveryFee === 0 ? "line-through text-gray-400" : ""
                    }
                  >
                    ₹{deliveryFee === 0 ? 40 : deliveryFee}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">🚀</span>
                  <span className="font-medium text-blue-900">
                    Estimated Delivery
                  </span>
                </div>
                <div className="text-sm text-blue-700">25-35 minutes</div>
                <div className="text-xs text-blue-600 mt-1">
                  Free delivery on orders above ₹500
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md mb-4"
              >
                {isLoading ? "Processing..." : "🚀 Proceed to Checkout"}
              </button>

              <SuccessPopup
                isOpen={popup.type === "success"}
                onClose={() => setPopup({ type: null, message: "" })}
                title="Payment Successful!"
              >
                <p className="text-center text-lg text-gray-600">
                  {popup.message}
                </p>
              </SuccessPopup>

              <ErrorPopup
                isOpen={popup.type === "error"}
                onClose={() => setPopup({ type: null, message: "" })}
                title="Oops!"
              >
                <p className="text-center text-lg text-gray-600">
                  {popup.message}
                </p>
              </ErrorPopup>

              {/* Security Badge */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>Secure checkout with Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
