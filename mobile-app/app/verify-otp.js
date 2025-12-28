import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../config/config";
import { authAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import useUIStore from "../store/uiStore";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const storedUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [email, setEmail] = useState(storedUser?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const showAlert = useUIStore((s) => s.showAlert);

  useEffect(() => {
    if (!email) {
      // If no email, navigate back to register
      router.replace("/register");
    }
  }, [email]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.sendOtp(email);
      showAlert({
        title: "OTP Sent",
        message: `OTP has been sent to ${email}`,
        showCancel: false,
      });
    } catch (err) {
      showAlert({
        title: "Error",
        message: err?.response?.data?.message || "Failed to send OTP",
        showCancel: false,
      });
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.trim().length === 0) {
      showAlert({
        title: "Error",
        message: "Please enter the OTP",
        showCancel: false,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.verifyOtp({ email, otp });
      if (res.success) {
        // Optimistically update local user state so UI updates immediately
        updateUser({ isEmailVerified: true });
        // Also refresh user from server in background to sync full user object
        try {
          const me = await authAPI.getCurrentUser();
          if (me && me.success && me.user) {
            updateUser(me.user);
          }
        } catch (e) {
          console.warn("Failed to refresh user after verify:", e?.message || e);
        }
        showAlert({
          title: "Verified",
          message: "Email verified successfully",
          onConfirm: () => router.replace("/(tabs)"),
          showCancel: false,
        });
      } else {
        showAlert({
          title: "Verification Failed",
          message: res.message || "Invalid OTP",
          showCancel: false,
        });
      }
    } catch (err) {
      showAlert({
        title: "Error",
        message: err?.response?.data?.message || "Failed to verify OTP",
        showCancel: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Enter the code we sent to your email
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>OTP Code</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={8}
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resend}
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={styles.resendText}>
            {resending ? "Resending..." : "Resend Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingTop: 60, paddingBottom: 24, alignItems: "center" },
  back: { position: "absolute", left: 20, top: 60 },
  title: { color: COLORS.white, fontSize: 24, fontWeight: "700" },
  subtitle: { color: COLORS.white, marginTop: 6 },
  form: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  label: { color: COLORS.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    color: COLORS.text,
  },
  verifyButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyText: { color: COLORS.white, fontWeight: "700" },
  resend: { marginTop: 12, alignItems: "center" },
  resendText: { color: COLORS.primary, fontWeight: "600" },
});
