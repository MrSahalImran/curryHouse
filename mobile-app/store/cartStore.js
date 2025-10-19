import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "@curry_house_cart";

const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  // Initialize cart from storage
  initCart: async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const items = JSON.parse(cartData);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({ items, totalItems, totalPrice });
      }
    } catch (error) {
      console.error("Init cart error:", error);
    }
  },

  // Save cart to storage
  saveCart: async (items) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Save cart error:", error);
    }
  },

  // Add item to cart
  addItem: (item) => {
    const { items } = get();
    const existingItemIndex = items.findIndex((i) => i._id === item._id);

    let newItems;
    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
    } else {
      // New item
      newItems = [...items, { ...item, quantity: 1 }];
    }

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    set({ items: newItems, totalItems, totalPrice });
    get().saveCart(newItems);
  },

  // Remove item from cart
  removeItem: (itemId) => {
    const { items } = get();
    const newItems = items.filter((item) => item._id !== itemId);

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    set({ items: newItems, totalItems, totalPrice });
    get().saveCart(newItems);
  },

  // Update item quantity
  updateQuantity: (itemId, quantity) => {
    const { items } = get();

    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const newItems = items.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    set({ items: newItems, totalItems, totalPrice });
    get().saveCart(newItems);
  },

  // Increase quantity
  increaseQuantity: (itemId) => {
    const { items } = get();
    const item = items.find((i) => i._id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity + 1);
    }
  },

  // Decrease quantity
  decreaseQuantity: (itemId) => {
    const { items } = get();
    const item = items.find((i) => i._id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity - 1);
    }
  },

  // Clear cart
  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
    get().saveCart([]);
  },

  // Get item quantity
  getItemQuantity: (itemId) => {
    const { items } = get();
    const item = items.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  },
}));

export default useCartStore;
