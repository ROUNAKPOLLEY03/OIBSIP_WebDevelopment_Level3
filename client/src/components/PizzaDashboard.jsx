import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";

const PizzaDashboard = () => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const SimpleToast = ({ isVisible, message }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-green-500 text-white px-8 py-6 rounded-xl shadow-2xl animate-bounce text-xl font-semibold">
          🍕 {message}
        </div>
      </div>
    );
  };

  const handleAddToCart = async (pizza) => {
    try {
      const orderItem = {
        userId: user._id,
        ...pizza,
      };
      const response = await cartAPI.addToCart(orderItem);

      // Show simple success notification
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Sample pizza varieties data matching Cart schema
  const pizzaVarieties = [
    {
      id: 1,
      name: "Margherita Classic",
      description: "Traditional Italian pizza with fresh basil and mozzarella",
      basePrice: 359,
      image: "🍕",
      rating: 4.8,
      crust: "thin",
      sauce: "tomato",
      cheeses: ["mozzarella"],
      toppings: ["fresh basil", "cherry tomatoes"],
      category: "Classic",
      size: "Small",
    },
    {
      id: 2,
      name: "Pepperoni Supreme",
      description: "Loaded with premium pepperoni and extra cheese",
      basePrice: 329,
      image: "🍕",
      rating: 4.9,
      crust: "regular",
      sauce: "tomato",
      cheeses: ["mozzarella", "cheddar"],
      toppings: ["pepperoni"],
      category: "Meat Lovers",
      size: "Medium",
    },
    {
      id: 3,
      name: "Veggie Delight",
      description: "Fresh vegetables with herbs and multiple cheese blend",
      basePrice: 419,
      image: "🍕",
      rating: 4.6,
      crust: "whole wheat",
      sauce: "pesto",
      cheeses: ["mozzarella", "goat cheese"],
      toppings: ["bell peppers", "mushrooms", "red onions", "olives"],
      category: "Vegetarian",
      size: "Large",
    },
    {
      id: 4,
      name: "Meat Lovers Paradise",
      description: "For carnivores: pepperoni, sausage, ham, and bacon",
      basePrice: 419,
      image: "🍕",
      rating: 4.7,
      crust: "thick",
      sauce: "bbq",
      cheeses: ["mozzarella", "cheddar"],
      toppings: ["pepperoni", "italian sausage", "ham", "bacon"],
      category: "Meat Lovers",
      size: "Large",
    },
    {
      id: 5,
      name: "Hawaiian Tropical",
      description: "Sweet and savory combination with ham and pineapple",
      basePrice: 359,
      image: "🍕",
      rating: 4.3,
      crust: "regular",
      sauce: "tomato",
      cheeses: ["mozzarella"],
      toppings: ["ham", "pineapple"],
      category: "Specialty",
      size: "Medium",
    },
    {
      id: 6,
      name: "Four Cheese Blend",
      description: "Rich combination of four premium cheeses",
      basePrice: 329,
      image: "🍕",
      rating: 4.5,
      crust: "thin",
      sauce: "white sauce",
      cheeses: ["mozzarella", "parmesan", "gorgonzola", "ricotta"],
      toppings: ["herbs"],
      category: "Cheese Lovers",
      size: "Large",
    },
    {
      id: 7,
      name: "Spicy Paneer Tikka",
      description: "Indian twist with spicy paneer, capsicum, and onions",
      basePrice: 389,
      image: "🍕",
      rating: 4.4,
      crust: "regular",
      sauce: "spicy tomato",
      cheeses: ["mozzarella"],
      toppings: ["paneer", "capsicum", "onions"],
      category: "Specialty",
      size: "Medium",
    },
    {
      id: 8,
      name: "BBQ Chicken Feast",
      description: "Grilled chicken chunks with smoky BBQ sauce",
      basePrice: 449,
      image: "🍕",
      rating: 4.8,
      crust: "thick",
      sauce: "bbq",
      cheeses: ["mozzarella", "cheddar"],
      toppings: ["grilled chicken", "red onions"],
      category: "Meat Lovers",
      size: "Large",
    },
    {
      id: 9,
      name: "Mediterranean Veggie",
      description: "A mix of olives, feta cheese, and sun-dried tomatoes",
      basePrice: 399,
      image: "🍕",
      rating: 4.6,
      crust: "thin",
      sauce: "olive oil base",
      cheeses: ["feta", "mozzarella"],
      toppings: ["sun-dried tomatoes", "olives", "spinach"],
      category: "Vegetarian",
      size: "Medium",
    },
    {
      id: 10,
      name: "Mexican Fiesta",
      description: "Spicy jalapeños, corn, and beans for a Mexican punch",
      basePrice: 379,
      image: "🍕",
      rating: 4.5,
      crust: "regular",
      sauce: "spicy tomato",
      cheeses: ["mozzarella"],
      toppings: ["jalapeños", "sweet corn", "black beans"],
      category: "Specialty",
      size: "Small",
    },
    {
      id: 11,
      name: "Truffle Mushroom",
      description: "Luxury pizza with truffle oil and wild mushrooms",
      basePrice: 499,
      image: "🍕",
      rating: 4.9,
      crust: "thin",
      sauce: "white sauce",
      cheeses: ["mozzarella", "parmesan"],
      toppings: ["wild mushrooms", "truffle oil"],
      category: "Gourmet",
      size: "Large",
    },
    {
      id: 12,
      name: "Cheesy Garlic Burst",
      description: "Cheese-filled crust with roasted garlic topping",
      basePrice: 359,
      image: "🍕",
      rating: 4.4,
      crust: "cheese burst",
      sauce: "garlic butter",
      cheeses: ["mozzarella"],
      toppings: ["roasted garlic"],
      category: "Cheese Lovers",
      size: "Medium",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Available Pizza Varieties
          </h2>
          <p className="text-gray-600">
            Choose from our delicious selection of handcrafted pizzas
          </p>
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pizzaVarieties.map((pizza) => (
            <div
              key={pizza.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{pizza.image}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      {pizza.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pizza.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {pizza.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Crust:</span> {pizza.crust}
                  </div>
                  <div>
                    <span className="font-medium">Sauce:</span> {pizza.sauce}
                  </div>
                  <div>
                    <span className="font-medium">Cheeses:</span>{" "}
                    {pizza.cheeses.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Toppings:</span>{" "}
                    {pizza.toppings.join(", ")}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{pizza.basePrice}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate("/pizza-builder")}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      Customize
                    </button>
                    <button
                      onClick={() => handleAddToCart(pizza)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SimpleToast isVisible={showToast} message="Added to cart!" />
    </div>
  );
};

export default PizzaDashboard;
