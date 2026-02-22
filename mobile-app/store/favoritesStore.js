import { create } from "zustand";
import { userAPI } from "../services/api";
import useAuthStore from "./authStore";

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        set({ favorites: [], loading: false, error: null });
        return;
      }

      const res = await userAPI.getFavorites();
      set({ favorites: res.data || [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addFavorite: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        set({ loading: false, error: "Please log in to use favorites" });
        return false;
      }

      await userAPI.addFavorite(itemId);
      await get().fetchFavorites();
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return false;
    }
  },

  removeFavorite: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        set({ loading: false, error: "Please log in to use favorites" });
        return false;
      }

      await userAPI.removeFavorite(itemId);
      await get().fetchFavorites();
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return false;
    }
  },
}));

export default useFavoritesStore;
