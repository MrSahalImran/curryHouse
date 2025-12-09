// API Configuration
// Prefer EXPO_PUBLIC_API_URL so you can switch between local/remote backends without editing code.
// For local dev on emulator use: http://10.0.2.2:5000/api
// For local dev on device use: http://<your-LAN-IP>:5000/api
export const API_URL = "https://curryhouse-dw7s.onrender.com/api";

const config = {
  API_URL,
  endpoints: {
    auth: {
      register: `${API_URL}/auth/register`,
      login: `${API_URL}/auth/login`,
      me: `${API_URL}/auth/me`,
    },
    menu: {
      getAll: `${API_URL}/menu`,
      getById: (id) => `${API_URL}/menu/${id}`,
      categories: `${API_URL}/menu/categories`,
      popular: `${API_URL}/menu/popular/items`,
    },
    orders: {
      create: `${API_URL}/orders`,
      getAll: `${API_URL}/orders`,
      getById: (id) => `${API_URL}/orders/${id}`,
      cancel: (id) => `${API_URL}/orders/${id}/cancel`,
    },
    user: {
      profile: `${API_URL}/user/profile`,
      favorites: `${API_URL}/user/favorites`,
      addFavorite: (id) => `${API_URL}/user/favorites/${id}`,
      removeFavorite: (id) => `${API_URL}/user/favorites/${id}`,
    },
  },
};

export default config;

// Restaurant Info
export const RESTAURANT_INFO = {
  name: "Curry House Jar",
  phone: "+47 67155555",
  email: "order@curryhousejar.no",
  address: "Jar, Bærum, Norway",
  hours: {
    saturday: "14:00 - 22:00",
    sunday: "14:00 - 22:00",
    monday: "15:00 - 22:00",
    tuesday: "15:00 - 22:00",
    wednesday: "15:00 - 22:00",
    thursday: "15:00 - 22:00",
    friday: "14:00 - 22:00",
  },
  description:
    "En indisk takeaway drevet av erfarne kokker i Bærum. Nyt autentisk indisk mat på Jar!",
};

// Color Theme (based on Curry House Jar website)
export const COLORS = {
  primary: "#FF6B35", // Orange (main brand color)
  secondary: "#F7931E", // Light orange
  accent: "#C1272D", // Red accent
  background: "#FFFFFF", // White
  surface: "#F5F5F5", // Light gray
  text: "#333333", // Dark gray
  textLight: "#666666", // Medium gray
  textMuted: "#999999", // Light gray
  border: "#E0E0E0", // Border gray
  success: "#4CAF50", // Green
  warning: "#FFC107", // Amber
  error: "#F44336", // Red
  info: "#2196F3", // Blue
  white: "#FFFFFF",
  black: "#000000",
};
