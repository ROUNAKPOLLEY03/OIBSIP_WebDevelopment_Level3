import React, { useEffect, useState } from "react";
import { pizzaAPI } from "../utils/api.js";
import { cartAPI } from "../utils/api.js";
import { CartSuccessPopup } from "./Popup.jsx";
import { useNavigate } from "react-router-dom";

// Centralized price calculation - same logic as backend and cart
const calculatePizzaPrice = (pizzaItem) => {
  let basePrice = 0;

  // Base price by size (ignore ingredient prices, use fixed pricing)
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

  // Add topping costs (₹30 per topping)
  const toppingCost = (pizzaItem.toppings?.length || 0) * 30;

  // Add premium cheese cost (₹50 for Cheddar or Parmesan)
  const premiumCheeses = ["Cheddar", "Parmesan"];
  const hasPremiumCheese = pizzaItem.cheeses?.some((cheese) =>
    premiumCheeses.includes(cheese.name || cheese)
  );
  const cheeseCost = hasPremiumCheese ? 50 : 0;

  return basePrice + toppingCost + cheeseCost;
};

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await pizzaAPI.getIngredients();
        setIngredients(data);
        setError(null);
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
  const [selectedSize, setSelectedSize] = useState('Medium (12")'); // Default to Medium string
  const [activeTab, setActiveTab] = useState("base");
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    if (ingredients?.data) {
      const { bases, sauces, cheeses, sizes } = ingredients.data;

      setSelectedBase(bases[0]);
      setSelectedSauce(sauces[0]);
      setSelectedCheeses([cheeses[0]]);
      // Keep selectedSize as string for consistency with pricing logic
    }
  }, [ingredients]);

  // Get current pizza configuration for price calculation
  const getCurrentPizzaConfig = () => ({
    size: selectedSize,
    toppings: selectedToppings,
    cheeses: selectedCheeses,
  });

  // Calculate total price using centralized logic
  const calculateTotalPrice = () => {
    return calculatePizzaPrice(getCurrentPizzaConfig());
  };

  // Get price breakdown for display
  const getPriceBreakdown = () => {
    const config = getCurrentPizzaConfig();

    let basePrice = 0;
    switch (config.size) {
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

    const toppingCost = (config.toppings?.length || 0) * 30;
    const premiumCheeses = ["Cheddar", "Parmesan"];
    const hasPremiumCheese = config.cheeses?.some((cheese) =>
      premiumCheeses.includes(cheese.name || cheese)
    );
    const cheeseCost = hasPremiumCheese ? 50 : 0;

    return {
      basePrice,
      toppingCost,
      cheeseCost,
      total: basePrice + toppingCost + cheeseCost,
    };
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
        crust: selectedBase.name, // Send name instead of object
        sauce: selectedSauce.name, // Send name instead of object
        cheeses: selectedCheeses.map((c) => c.name), // Send names array
        toppings: selectedToppings.map((t) => t.name), // Send names array
      };

      const response = await cartAPI.addToCart(selectedItems);

      setShowCartPopup(true);

      // Reset to defaults
      if (ingredients?.data) {
        const { bases, sauces, cheeses } = ingredients.data;
        setSelectedBase(bases[0]);
        setSelectedSauce(sauces[0]);
        setSelectedCheeses([cheeses[0]]);
        setSelectedSize('Medium (12")');
        setSelectedToppings([]);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
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

  // Loading state
  if (!ingredients?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const { bases, sauces, cheeses, toppings, sizes } = ingredients.data;
  const priceBreakdown = getPriceBreakdown();

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
                {['Small (8")', 'Medium (12")', 'Large (16")'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🍕</div>
                      <div className="font-semibold">{size.split(" ")[0]}</div>
                      <div className="text-sm text-gray-600">
                        {size.split(" ")[1]}
                      </div>
                      <div className="text-orange-600 font-medium mt-1">
                        ₹
                        {size === 'Small (8")'
                          ? 199
                          : size === 'Medium (12")'
                          ? 299
                          : 399}
                      </div>
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
                            <div className="text-sm text-gray-500 mt-1">
                              Included in base price
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
                            <div className="text-sm text-gray-500 mt-1">
                              Included in base price
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
                      {cheeses.map((cheese) => {
                        const isPremium = ["Cheddar", "Parmesan"].includes(
                          cheese.name
                        );
                        return (
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
                              <div className="text-3xl mb-2">
                                {cheese.image}
                              </div>
                              <div className="font-semibold text-gray-900">
                                {cheese.name}
                              </div>
                              <div className="text-orange-600 font-medium">
                                {isPremium ? "+₹50" : "Free"}
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
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Toppings Selection */}
                {activeTab === "toppings" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Your Toppings (₹30 each)
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
                              +₹30
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
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {selectedSize}
                </div>
              </div>

              {/* Order Summary with Real Pricing */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Base ({selectedSize})</span>
                  <span>₹{priceBreakdown.basePrice}</span>
                </div>

                {selectedToppings.length > 0 && (
                  <div className="flex justify-between">
                    <span>Toppings ({selectedToppings.length} × ₹30)</span>
                    <span>₹{priceBreakdown.toppingCost}</span>
                  </div>
                )}

                {priceBreakdown.cheeseCost > 0 && (
                  <div className="flex justify-between">
                    <span>Premium Cheese</span>
                    <span>₹{priceBreakdown.cheeseCost}</span>
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
          crust: selectedBase?.name,
          sauce: selectedSauce?.name,
          cheeses: selectedCheeses?.map((c) => c.name),
          toppings: selectedToppings?.map((t) => t.name),
        }}
        totalPrice={calculateTotalPrice()}
        onViewCart={() => {
          navigate("/cart");
        }}
      />
    </div>
  );
};

export default PizzaBuilder;
