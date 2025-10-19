import { create } from "zustand";
import { menuAPI } from "../services/api";

const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: ["All"],
  popularItems: [],
  selectedCategory: "All",
  searchQuery: "",
  isLoading: false,
  error: null,

  // Fetch all menu items
  fetchMenuItems: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await menuAPI.getAll(params);

      if (response.success) {
        set({
          menuItems: response.data,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Fetch menu error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch menu items",
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await menuAPI.getCategories();

      if (response.success) {
        set({ categories: response.data });
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  },

  // Fetch popular items
  fetchPopularItems: async () => {
    try {
      const response = await menuAPI.getPopular();

      if (response.success) {
        set({ popularItems: response.data });
      }
    } catch (error) {
      console.error("Fetch popular items error:", error);
    }
  },

  // Set selected category
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchMenuItems({
      category: category !== "All" ? category : undefined,
    });
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchMenuItems({ search: query || undefined });
  },

  // Get filtered items
  getFilteredItems: () => {
    const { menuItems, selectedCategory, searchQuery } = get();
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useMenuStore;
