import { create } from "zustand";
import { ordersAPI } from "../services/api";

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Create new order
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.create(orderData);

      if (response.success) {
        set({
          currentOrder: response.data,
          isLoading: false,
        });

        // Refresh orders list
        get().fetchOrders();

        return { success: true, order: response.data };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create order";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all orders
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getAll();

      if (response.success) {
        set({
          orders: response.data,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch orders",
      });
    }
  },

  // Fetch single order
  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getById(orderId);

      if (response.success) {
        set({
          currentOrder: response.data,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Fetch order error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch order",
      });
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.cancel(orderId);

      if (response.success) {
        set({ isLoading: false });

        // Refresh orders list
        get().fetchOrders();

        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel order";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useOrderStore;
