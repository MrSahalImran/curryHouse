import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../config/config";
import useAuthStore from "./authStore";

const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${API_URL}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ addresses: res.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addAddress: async (address) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      // Map 'zip' to 'postalCode' for backend compatibility
      const payload = { ...address, postalCode: address.zip };
      delete payload.zip;
      const res = await axios.post(`${API_URL}/user/addresses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ addresses: res.data.data, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return false;
    }
  },

  updateAddress: async (id, address) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      // Map 'zip' to 'postalCode' for backend compatibility
      const payload = { ...address, postalCode: address.zip };
      delete payload.zip;
      const res = await axios.put(`${API_URL}/user/addresses/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ addresses: res.data.data, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return false;
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.delete(`${API_URL}/user/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ addresses: res.data.data, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return false;
    }
  },

  setDefaultAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.patch(
        `${API_URL}/user/addresses/${id}/default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ addresses: res.data.data, loading: false });
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

export default useAddressStore;
