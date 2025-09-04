import React, { useEffect, useState } from "react";
import { pizzaAPI } from "../utils/api.js";
import { cartAPI } from "../utils/api.js";
import { CartSuccessPopup } from "./Popup.jsx";
import { useNavigate } from "react-router-dom";

const PizzaBuilder = () => {
  // Mock data - will replace with API later
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await pizzaAPI.getIngredients();
        setIngredients(data);
        setError(null); // clear error if success
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        setError("Failed to load ingredients. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // State management
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheeses, setSelectedCheeses] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("base");
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    if (ingredients?.data) {
      const { bases, sauces, cheeses, sizes } = ingredients.data;

      setSelectedBase(bases[0]);
      setSelectedSauce(sauces[0]);
      setSelectedCheeses([cheeses[0]]);
      setSelectedSize(sizes[1]); // Default to Medium
    }
  }, [ingredients]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedBase || !selectedSauce || !selectedSize) return "0.00";

    let basePrice = selectedBase.price;
    let saucePrice = selectedSauce.price;
    let cheesePrice = selectedCheeses.reduce(
      (total, cheese) => total + cheese.price,
      0
    );
    let toppingsPrice = selectedToppings.reduce(
      (total, topping) => total + topping.price,
      0
    );

    let subtotal = basePrice + saucePrice + cheesePrice + toppingsPrice;
    return (subtotal * selectedSize.multiplier).toFixed(2);
  };

  // Handle topping selection
  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const isSelected = prev.find((t) => t.id === topping.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Handle cheese selection
  const toggleCheese = (cheese) => {
    setSelectedCheeses((prev) => {
      const isSelected = prev.find((c) => c.id === cheese.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== cheese.id);
      } else {
        return [...prev, cheese];
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      const selectedItems = {
        size: selectedSize,
        crust: selectedBase,
        sauce: selectedSauce,
        cheeses: selectedCheeses,
        toppings: selectedToppings,
      };

      const response = await cartAPI.addToCart(selectedItems);
      console.log("Added to cart:", response);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setShowCartPopup(true);
      setSelectedBase(bases[0]);
      setSelectedSauce(sauces[0]);
      setSelectedCheeses([cheeses[0]]);
      setSelectedSize(sizes[1]); // Default to Medium
      setSelectedToppings([]);
    }
  };

  const tabs = [
    { id: "base", name: "Base", icon: "🍕" },
    { id: "sauce", name: "Sauce", icon: "🍅" },
    { id: "cheese", name: "Cheese", icon: "🧀" },
    { id: "toppings", name: "Toppings", icon: "🥬" },
  ];

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Destructure ingredients data
  if (!ingredients?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { bases, sauces, cheeses, toppings, sizes } = ingredients.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍕 Build Your Perfect Pizza
          </h1>
          <p className="text-lg text-gray-600">
            Customize every ingredient to create your dream pizza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pizza Customization */}
          <div className="lg:col-span-2">
            {/* Size Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📏 Choose Size
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🍕</div>
                      <div className="font-semibold">{size.name}</div>
                      <div className="text-sm text-gray-600">{size.size}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {/* Base Selection */}
                {activeTab === "base" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Your Pizza Base
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bases.map((base) => (
                        <button
                          key={base.id}
                          onClick={() => setSelectedBase(base)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedBase?.id === base.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{base.image}</div>
                            <div className="font-semibold text-gray-900">
                              {base.name}
                            </div>
                            <div className="text-orange-600 font-medium">
                              ₹{base.price}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sauce Selection */}
                {activeTab === "sauce" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Your Sauce
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sauces.map((sauce) => (
                        <button
                          key={sauce.id}
                          onClick={() => setSelectedSauce(sauce)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedSauce?.id === sauce.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{sauce.image}</div>
                            <div className="font-semibold text-gray-900">
                              {sauce.name}
                            </div>
                            <div className="text-orange-600 font-medium">
                              {sauce.price === 0 ? "Free" : `+₹${sauce.price}`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cheese Selection */}
                {activeTab === "cheese" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Your Cheese (Multiple selection allowed)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {cheeses.map((cheese) => (
                        <button
                          key={cheese.id}
                          onClick={() => toggleCheese(cheese)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedCheeses.find((c) => c.id === cheese.id)
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{cheese.image}</div>
                            <div className="font-semibold text-gray-900">
                              {cheese.name}
                            </div>
                            <div className="text-orange-600 font-medium">
                              +₹{cheese.price}
                            </div>
                            {selectedCheeses.find(
                              (c) => c.id === cheese.id
                            ) && (
                              <div className="mt-1">
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                  ✓ Selected
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toppings Selection */}
                {activeTab === "toppings" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Your Toppings (Multiple selection allowed)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {toppings.map((topping) => (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedToppings.find((t) => t.id === topping.id)
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{topping.image}</div>
                            <div className="font-semibold text-gray-900">
                              {topping.name}
                            </div>
                            <div className="text-orange-600 font-medium">
                              +₹{topping.price}
                            </div>
                            {selectedToppings.find(
                              (t) => t.id === topping.id
                            ) && (
                              <div className="mt-1">
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                  ✓ Selected
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Pizza Preview & Summary */}
          <div className="lg:col-span-1">
            {/* Pizza Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                🍕 Your Pizza Preview
              </h3>

              {/* Visual Pizza */}
              <div
                className="relative mx-auto mb-6"
                style={{ width: "200px", height: "200px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full border-4 border-yellow-400"></div>

                {/* Sauce Layer */}
                <div className="absolute inset-2 bg-red-400 rounded-full opacity-70"></div>

                {/* Cheese Layer */}
                {selectedCheeses.length > 0 && (
                  <div className="absolute inset-3 bg-yellow-100 rounded-full opacity-80"></div>
                )}

                {/* Toppings */}
                <div className="absolute inset-0 flex flex-wrap items-center justify-center p-4">
                  {selectedToppings.slice(0, 6).map((topping, index) => (
                    <span
                      key={topping.id}
                      className="text-lg m-1"
                      style={{
                        transform: `rotate(${index * 60}deg) translateY(-20px)`,
                      }}
                    >
                      {topping.image}
                    </span>
                  ))}
                </div>

                {/* Size Indicator */}
                {selectedSize && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {selectedSize.name} ({selectedSize.size})
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 text-sm">
                {selectedBase && (
                  <div className="flex justify-between">
                    <span>Base: {selectedBase.name}</span>
                    <span>₹{selectedBase.price}</span>
                  </div>
                )}
                {selectedSauce && (
                  <div className="flex justify-between">
                    <span>Sauce: {selectedSauce.name}</span>
                    <span>
                      {selectedSauce.price === 0
                        ? "Free"
                        : `₹${selectedSauce.price}`}
                    </span>
                  </div>
                )}

                {selectedCheeses.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">
                      Cheese:
                    </div>
                    {selectedCheeses.map((cheese) => (
                      <div
                        key={cheese.id}
                        className="flex justify-between ml-2"
                      >
                        <span>• {cheese.name}</span>
                        <span>₹{cheese.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedToppings.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">
                      Toppings:
                    </div>
                    {selectedToppings.map((topping) => (
                      <div
                        key={topping.id}
                        className="flex justify-between ml-2"
                      >
                        <span>• {topping.name}</span>
                        <span>₹{topping.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSize && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Size Multiplier ({selectedSize.name})</span>
                      <span>×{selectedSize.multiplier}</span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-orange-600">
                  <span>Total:</span>
                  <span>₹{calculateTotalPrice()}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🛒 Add to Cart - ₹{calculateTotalPrice()}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CartSuccessPopup
        isOpen={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        pizzaDetails={{
          size: selectedSize,
          crust: selectedBase,
          sauce: selectedSauce,
          cheeses: selectedCheeses,
          toppings: selectedToppings,
        }}
        totalPrice={calculateTotalPrice()}
        onViewCart={() => {
          // Navigate to cart page
          navigate("/cart");
        }}
      />
    </div>
  );
};

export default PizzaBuilder;
