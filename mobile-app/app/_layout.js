import { useEffect } from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import AlertModal from "../components/AlertModal";
import useUIStore from "../store/uiStore";

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
      <AlertModal
        visible={useUIStore((s) => s.alertVisible)}
        title={useUIStore((s) => s.alertTitle)}
        message={useUIStore((s) => s.alertMessage)}
        showCancel={useUIStore((s) => s.alertShowCancel)}
        cancelText={useUIStore((s) => s.alertCancelText)}
        confirmText={useUIStore((s) => s.alertConfirmText)}
        onCancel={() => {
          const cb = useUIStore.getState().alertOnCancel;
          useUIStore.getState().hideAlert();
          try {
            cb && cb();
          } catch (e) {}
        }}
        onConfirm={() => {
          const cb = useUIStore.getState().alertOnConfirm;
          useUIStore.getState().hideAlert();
          try {
            cb && cb();
          } catch (e) {}
        }}
      />
    </SafeAreaProvider>
  );
}
