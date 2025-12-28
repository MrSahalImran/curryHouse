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
import { useRouter } from "expo-router";
import { COLORS } from "../config/config";
import { authAPI } from "../services/api";
import useUIStore from "../store/uiStore";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const showAlert = useUIStore((s) => s.showAlert);

  const [email, setEmail] = useState("");
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

  const handleSubmit = async () => {
    if (!email || email.trim().length === 0) {
      showAlert({
        title: "Error",
        message: "Please enter your email",
        showCancel: false,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email.trim());
      if (res.success) {
        showAlert({
          title: "OTP Sent",
          message:
            "If the email exists, we've sent a reset code. Check your inbox.",
          showCancel: false,
        });
        router.push(
          `/reset-password?email=${encodeURIComponent(email.trim())}`
        );
      } else {
        showAlert({
          title: "Error",
          message: res.message || "Failed to send OTP",
          showCancel: false,
        });
      }
    } catch (err) {
      showAlert({
        title: "Error",
        message: err?.message || "Network error",
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account.
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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
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
