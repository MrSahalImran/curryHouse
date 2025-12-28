import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "../../../config/config";
import { userAPI, authAPI } from "../../../services/api";
import useAuthStore from "../../../store/authStore";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resending, setResending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getNotifications();
      if (res.success) setNotifications(res.data || []);
    } catch (err) {
      console.warn("Failed to load notifications:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (currentUser?.isEmailVerified) {
      load();
    }
  }, [currentUser?.isEmailVerified]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCardResend = async () => {
    if (!currentUser?.email) return Alert.alert("Error", "No email available");
    setResending(true);
    try {
      await authAPI.sendOtp(currentUser.email);
      Alert.alert("OTP Sent", `OTP has been sent to ${currentUser.email}`);
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setResending(false);
    }
  };

  const handleCardVerifyNow = async () => {
    if (!currentUser?.email) return Alert.alert("Error", "No email available");
    setResending(true);
    try {
      await authAPI.sendOtp(currentUser.email);
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setResending(false);
      const email = currentUser?.email || "";
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  };

  const markRead = async (id) => {
    try {
      await userAPI.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("Failed to mark read", err?.message || err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => markRead(item._id)}
      style={[styles.item, item.read ? styles.read : null]}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemMessage}>{item.message}</Text>
      <Text style={styles.itemTime}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      {currentUser && !currentUser.isEmailVerified ? (
        <View style={styles.verifyCard}>
          <Text style={styles.verifyTitle}>Verify your email</Text>
          <Text style={styles.verifyText}>
            Please verify your email to unlock all features. Tap "Verify now" to
            enter the code or "Resend code" to receive a new one.
          </Text>
          <View style={styles.verifyActions}>
            <TouchableOpacity
              style={styles.verifyBtnPrimary}
              onPress={handleCardVerifyNow}
            >
              <Text style={styles.verifyBtnText}>Verify now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.verifyBtnSecondary}
              onPress={handleCardResend}
              disabled={resending}
            >
              <Text style={styles.verifyBtnTextSecondary}>
                {resending ? "Resending..." : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <Text style={styles.unread}>
        {notifications.filter((n) => !n.read).length} unread
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  read: { opacity: 0.6 },
  itemTitle: { fontWeight: "700", marginBottom: 6 },
  itemMessage: { color: "#444" },
  itemTime: { marginTop: 8, color: "#888", fontSize: 12 },
  empty: { textAlign: "center", marginTop: 40, color: "#666" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.surface,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  refreshText: { color: "#fff", fontWeight: "700" },
  unread: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    color: COLORS.textMuted,
  },
  verifyCard: {
    backgroundColor: "#fffbea",
    margin: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ffe8a8",
  },
  verifyTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  verifyText: { color: "#444", marginBottom: 10 },
  verifyActions: { flexDirection: "row" },
  verifyBtnPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  verifyBtnText: { color: "#fff", fontWeight: "700" },
  verifyBtnSecondary: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  verifyBtnTextSecondary: { color: COLORS.textMuted, fontWeight: "700" },
});
