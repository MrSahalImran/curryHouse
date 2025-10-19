import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../config/config";
import useAuthStore from "./authStore";

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${API_URL}/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: res.data.data, loading: false });
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
      const token = useAuthStore.getState().token;
      const res = await axios.post(
        `${API_URL}/user/favorites`,
        { itemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ favorites: res.data.data, loading: false });
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
      const token = useAuthStore.getState().token;
      const res = await axios.delete(`${API_URL}/user/favorites/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: res.data.data, loading: false });
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
