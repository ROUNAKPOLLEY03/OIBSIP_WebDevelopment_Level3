import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock user data - replace with your actual useAuth hook
  const { user } = useAuth();

  // If email is NOT verified, show verification prompt
  if (!user?.isEmailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Email Verification Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
              Hi {user?.name}! We've sent a verification link to
              <span className="font-semibold text-orange-600 block mt-1">
                {user?.email}
              </span>
            </p>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">
                📋 Next Steps:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Check your inbox for verification email</li>
                <li>2. Click the verification link in the email</li>
                <li>3. You'll be automatically redirected here</li>
                <li>4. Start ordering delicious pizzas! 🍕</li>
              </ol>
            </div>

            {/* Help Section */}
            <div className="border-t pt-4 text-sm text-gray-500">
              <p className="mb-2">📧 Can't find the email?</p>
              <ul className="text-left space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure {user?.email} is correct</li>
                <li>• Try resending the verification email</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-400">
                Still having trouble?
                <a
                  href="mailto:support@pizzaapp.com"
                  className="text-orange-600 hover:text-orange-700 ml-1"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Demo Toggle (Remove this in production) */}
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                setUser({ ...user, isEmailVerified: !user.isEmailVerified })
              }
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              🔧 Demo: Toggle Verification Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If email IS verified, show the normal dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header with Verification Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}! 🎉
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Verified
            </span>
          </div>
          <p className="text-gray-600">
            Your pizza ordering experience starts here. Ready to create
            something delicious?
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
          {/* Profile Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Your Profile
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Order Pizza Card - Now Clickable */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-2 border-transparent hover:border-orange-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🍕</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Ready to Order
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  Pizza Builder
                </p>
                <Link
                  to="/pizza-builder"
                  className="text-sm text-green-600 font-medium"
                >
                  Click to start! →
                </Link>
              </div>
            </div>
          </div>

          {/* Order History Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Order History
                </h3>
                <p className="text-lg font-semibold text-gray-900">0 Orders</p>
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Reward Points
                </h3>
                <p className="text-lg font-semibold text-gray-900">0 Points</p>
                <p className="text-sm text-gray-500">Start ordering to earn!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
