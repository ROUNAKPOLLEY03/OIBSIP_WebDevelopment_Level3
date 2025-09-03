// client/src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            <span className="text-orange-600">🍕 PizzaApp</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            Create your perfect custom pizza with our amazing builder!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border border-orange-600 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose PizzaApp?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The ultimate pizza customization experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Custom Builder
              </h3>
              <p className="text-gray-600">
                Choose from 5 bases, 5 sauces, multiple cheese types, and fresh
                veggies to create your perfect pizza.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Integrated with Razorpay for safe and secure payment processing
                with multiple payment options.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Tracking
              </h3>
              <p className="text-gray-600">
                Track your order from kitchen to delivery with real-time status
                updates and notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Development Progress */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Development Progress (15-Day Sprint)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 mr-3">✅</span>
              <div>
                <div className="font-medium text-green-900">
                  Day 1-2: Backend Auth
                </div>
                <div className="text-sm text-green-700">Complete</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 mr-3">✅</span>
              <div>
                <div className="font-medium text-green-900">
                  Day 3: Frontend Auth
                </div>
                <div className="text-sm text-green-700">In Progress</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 mr-3">⏳</span>
              <div>
                <div className="font-medium text-yellow-900">
                  Day 4-5: Pizza Builder
                </div>
                <div className="text-sm text-yellow-700">Coming Soon</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 mr-3">⏳</span>
              <div>
                <div className="font-medium text-yellow-900">
                  Day 6-7: Payment
                </div>
                <div className="text-sm text-yellow-700">Coming Soon</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 mr-3">⏳</span>
              <div>
                <div className="font-medium text-yellow-900">
                  Day 8-12: Admin
                </div>
                <div className="text-sm text-yellow-700">Coming Soon</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 mr-3">⏳</span>
              <div>
                <div className="font-medium text-yellow-900">
                  Day 13-15: Polish
                </div>
                <div className="text-sm text-yellow-700">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
