import { Stack } from "expo-router";
import { COLORS } from "../../../config/config";

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="about" options={{ title: "About Us" }} />
      <Stack.Screen name="terms" options={{ title: "Terms & Conditions" }} />
      <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
    </Stack>
  );
}
