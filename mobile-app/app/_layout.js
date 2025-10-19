import { useEffect } from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

export default function RootLayout() {
  const { initAuth } = useAuthStore();
  const { initCart } = useCartStore();

  useEffect(() => {
    // Initialize auth and cart
    initAuth();
    initCart();
  }, []);

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
