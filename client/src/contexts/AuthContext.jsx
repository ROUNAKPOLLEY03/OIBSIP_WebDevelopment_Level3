// client/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // No need to check localStorage, just try to get current user
      // If cookie exists, this will work; if not, it will fail
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      // User is not logged in or token expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const response = await authAPI.register(userData);

      if (response.status === "success") {
        // No need to store token - it's in HTTP-only cookie
        setUser(response.data.user);
        return {
          success: true,
          data: response,
          message: "Account created successfully!",
        };
      } else {
        // Handle case where response exists but status isn't success
        const errorMessage = response.message || "Registration failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Registration error:", error); // Debug log
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const response = await authAPI.login(credentials);

      if (response.status === "success") {
        // No need to store token - it's in HTTP-only cookie
        setUser(response.data.user);
        return { success: true, data: response, message: "Login successful!" };
      } else {
        // Handle case where response exists but status isn't success
        const errorMessage = response.message || "Login failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Cookie will be cleared by server, just clear user state
      setUser(null);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.forgotPassword(email);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
