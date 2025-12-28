import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../config/config";
import { authAPI } from "../services/api";
import useUIStore from "../store/uiStore";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const prefillEmail = params?.email || "";
  const showAlert = useUIStore((s) => s.showAlert);

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  const handleSubmit = async () => {
    if (!email || !otp || !newPassword || !confirmPassword) {
      showAlert({
        title: "Error",
        message: "Please fill all fields",
        showCancel: false,
      });
      return;
    }

    if (newPassword.length < 6) {
      showAlert({
        title: "Error",
        message: "Password must be at least 6 characters",
        showCancel: false,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert({
        title: "Error",
        message: "Passwords do not match",
        showCancel: false,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.success) {
        showAlert({
          title: "Success",
          message: "Password updated. Please login.",
          showCancel: false,
          onConfirm: () => router.replace("/login"),
        });
      } else {
        showAlert({
          title: "Error",
          message: res.message || "Failed to reset password",
          showCancel: false,
        });
      }
    } catch (err) {
      showAlert({
        title: "Error",
        message:
          err?.response?.data?.message || err?.message || "Network error",
        showCancel: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.primary }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: keyboardVisible ? "flex-start" : "center",
          paddingTop: keyboardVisible ? 40 : 0,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the code from your email and choose a new password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textMuted}
          />

          <TextInput
            style={styles.input}
            placeholder="OTP Code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            placeholderTextColor={COLORS.textMuted}
          />

          <View style={{ position: "relative" }}>
            <TextInput
              style={styles.input}
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword((s) => !s)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={{ position: "relative" }}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((s) => !s)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Reset Password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/login")}
            style={{ marginTop: 12 }}
          >
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 24,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: COLORS.text,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  backText: {
    color: COLORS.primary,
    textAlign: "center",
  },
});
