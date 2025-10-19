import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RESTAURANT_INFO } from "../../config/config";
import useAuthStore from "../../store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={COLORS.white} />
        </View>
        <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
        <Text style={styles.userEmail}>{user?.email || ""}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-outline" size={24} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="location-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.menuItemText}>Delivery Addresses</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Favorites</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.infoItem}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{RESTAURANT_INFO.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="mail" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{RESTAURANT_INFO.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{RESTAURANT_INFO.address}</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/profile/about")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.menuItemText}>About Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/profile/terms")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.menuItemText}>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/profile/privacy")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  userSection: {
    backgroundColor: COLORS.primary,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.error,
    marginLeft: 8,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
    marginVertical: 24,
  },
});
