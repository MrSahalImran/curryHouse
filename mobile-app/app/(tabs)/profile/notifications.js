import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/config";
import { authAPI } from "../../../services/api";
import useAuthStore from "../../../store/authStore";
import { useRouter } from "expo-router";
import useUIStore from "../../../store/uiStore";

export default function NotificationsScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const showAlert = useUIStore((s) => s.showAlert);

  const handleCardResend = async () => {
    if (!currentUser?.email) {
      showAlert({
        title: "Error",
        message: "No email available",
        showCancel: false,
      });
      return;
    }
    try {
      await authAPI.sendOtp(currentUser.email);
      showAlert({
        title: "OTP Sent",
        message: `OTP has been sent to ${currentUser.email}`,
        showCancel: false,
      });
    } catch (err) {
      showAlert({
        title: "Error",
        message: err?.response?.data?.message || "Failed to send OTP",
        showCancel: false,
      });
    }
  };

  const handleCardVerifyNow = async () => {
    if (!currentUser?.email) {
      showAlert({
        title: "Error",
        message: "No email available",
        showCancel: false,
      });
      return;
    }
    try {
      await authAPI.sendOtp(currentUser.email);
    } catch (err) {
      showAlert({
        title: "Error",
        message: err?.response?.data?.message || "Failed to send OTP",
        showCancel: false,
      });
    } finally {
      const email = currentUser?.email || "";
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  };

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
            >
              <Text style={styles.verifyBtnTextSecondary}>Resend code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <Text style={styles.unread}>{0} unread</Text>
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
