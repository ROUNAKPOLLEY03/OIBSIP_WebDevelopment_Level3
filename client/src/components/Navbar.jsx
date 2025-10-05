// client/src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600">
                🍕 PizzaApp
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  // Admin Navigation
                  <>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Manage Orders
                    </Link>
                    <Link
                      to="/admin/inventory"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 text-sm bg-orange-100 px-2 py-1 rounded">
                        Admin: {user?.name || "User"}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  // Regular User Navigation
                  <>
                    <Link
                      to="/pizzas"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Pizza
                    </Link>
                    <Link
                      to="/pizza-builder"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Build Pizza
                    </Link>
                    <Link
                      to="/cart"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Go to Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Profile
                    </Link>

                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 text-sm">
                        Hello, {user?.name || "User"}!
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Unauthenticated User Navigation
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
