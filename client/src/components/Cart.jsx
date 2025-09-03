import React, { useState } from "react";

const Cart = () => {
  // Mock cart data - will replace with real data from context/API later
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Custom Veggie Supreme",
      base: "Thick Crust",
      sauce: "Marinara",
      cheeses: ["Mozzarella", "Cheddar"],
      toppings: ["Mushrooms", "Bell Peppers", "Onions", "Tomatoes"],
      size: 'Medium (12")',
      quantity: 2,
      price: 325,
      image: "🍕",
    },
    {
      id: 2,
      name: "Spicy Jalapeño Special",
      base: "Thin Crust",
      sauce: "Buffalo",
      cheeses: ["Mozzarella"],
      toppings: ["Jalapeños", "Onions", "Corn"],
      size: 'Large (14")',
      quantity: 1,
      price: 285,
      image: "🌶️",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery above ₹500
  const total = subtotal + tax + deliveryFee - discount;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛒 Your Cart ({cartItems.length} items)
          </h1>
          <p className="text-gray-600">
            Review your delicious pizza selections before checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
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
                        className="text-red-500 hover:text-red-700 font-medium"
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
                        <strong>Cheese:</strong> {item.cheeses.join(", ")}
                      </p>
                      <p>
                        <strong>Toppings:</strong> {item.toppings.join(", ")}
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
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold"
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
                            className="w-8 h-8 bg-orange-200 hover:bg-orange-300 rounded-full flex items-center justify-center font-bold"
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
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4">
                🚀 Proceed to Checkout
              </button>

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
