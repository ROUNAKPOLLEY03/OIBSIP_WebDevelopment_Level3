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

export default API;
