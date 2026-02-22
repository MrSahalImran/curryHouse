import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";

// Create axios instance
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const hadAuthHeader = Boolean(
      error.config?.headers?.Authorization ||
        error.config?.headers?.authorization
    );

    if (status === 401 && hadAuthHeader) {
      // Token expired/invalid for an authenticated request
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  sendOtp: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },
  verifyOtp: async ({ email, otp }) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async ({ email, otp, newPassword }) => {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Menu API
export const menuAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/menu", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/menu/categories");
    return response.data;
  },
  getPopular: async () => {
    const response = await api.get("/menu/popular/items");
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  },
  getFavorites: async () => {
    const response = await api.get("/user/favorites");
    return response.data;
  },
  addFavorite: async (menuItemId) => {
    const response = await api.post(`/user/favorites/${menuItemId}`);
    return response.data;
  },
  removeFavorite: async (menuItemId) => {
    const response = await api.delete(`/user/favorites/${menuItemId}`);
    return response.data;
  },
  // notifications endpoints removed
};

export default api;
