// client/src/utils/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // This is IMPORTANT for cookies!
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove the Authorization header interceptor since we're using cookies
// The browser will automatically send cookies with each request

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    console.log("Making API call to register with:", userData); // Debug log
    try {
      const response = await API.post("/auth/signup", userData);
      console.log("Register API response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Register API error:", error); // Debug log
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    console.log("Making API call to login with:", credentials); // Debug log
    try {
      const response = await API.post("/auth/login", credentials);
      console.log("Login API response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Login API error:", error); // Debug log
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgotPassword", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, passwords) => {
    const response = await API.patch(`/auth/resetPassword/${token}`, passwords);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await API.get(`/auth/verifyEmail/${token}`);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await API.get("/auth/logout");
    return response.data;
  },
};

// Pizza API functions
export const pizzaAPI = {
  // Get pizza ingredients
  getIngredients: async () => {
    const response = await API.get("/pizza/ingredients");
    return response.data;
  },

  // Calculate price
  calculatePrice: async (orderData) => {
    const response = await API.post("/pizza/calculate-price", orderData);
    return response.data;
  },

  // Create order
  createOrder: async (orderData) => {
    const response = await API.post("/pizza/order", orderData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await API.get("/pizza/orders");
    return response.data;
  },

  // Get specific order
  getOrder: async (orderId) => {
    const response = await API.get(`/pizza/orders/${orderId}`);
    return response.data;
  },
};

// Cart API functions
export const cartAPI = {
  // Add item to cart
  addToCart: async (cartData) => {
    try {
      const response = await API.post("/cart", cartData);
      return response.data;
    } catch (error) {
      console.error("Add to Cart API error:", error);
      throw error;
    }
  },

  // Get all cart items for current user
  getCart: async () => {
    try {
      const response = await API.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Get Cart API error:", error);
      throw error;
    }
  },

  // Remove single item
  removeFromCart: async (id) => {
    try {
      const response = await API.delete(`/cart/${id}`);
      return response.data;
    } catch (error) {
      console.error("Remove from Cart API error:", error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await API.delete("/cart");
      return response.data;
    } catch (error) {
      console.error("Clear Cart API error:", error);
      throw error;
    }
  },
};

// Payment API functions
export const paymentAPI = {
  // Create Razorpay order
  createOrder: async (amount) => {
    try {
      const response = await API.post("/payment/create-order", { amount });
      return response.data; // { id, amount, currency, receipt }
    } catch (error) {
      console.error("Create Payment Order API error:", error);
      throw error;
    }
  },

  // Verify Razorpay payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await API.post("/payment/verify-payment", paymentData);
      return response.data; // { success, message, orders }
    } catch (error) {
      console.error("Verify Payment API error:", error);
      throw error;
    }
  },
};

// Add these functions to your existing client/src/api/api.js file

// Admin API functions
export const adminAPI = {
  // Get all orders (Admin only)
  getAllOrders: async () => {
    try {
      const response = await API.get("/admin/orders");
      return response.data;
    } catch (error) {
      console.error("Get all orders API error:", error);
      throw error;
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await API.patch(`/admin/orders/${orderId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Update order status API error:", error);
      throw error;
    }
  },

  // Get admin statistics (Admin only)
  getAdminStats: async () => {
    try {
      const response = await API.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Get admin stats API error:", error);
      throw error;
    }
  },

  // Get single order details (Admin only)
  getOrderById: async (orderId) => {
    try {
      const response = await API.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Get order by ID API error:", error);
      throw error;
    }
  },
};

export default API;
