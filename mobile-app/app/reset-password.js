import React, { useState, useEffect, useRef } from "react";
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
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../config/config";
import { authAPI } from "../services/api";
import useUIStore from "../store/uiStore";

function OTPInput({ value, onChange, length = 6, onComplete, shakeAnim }) {
  const inputs = useRef([]);
  const digits = Array.from({ length }).map((_, i) => value?.[i] || "");

  const handleChange = (text, index) => {
    // handle pasted input or multi-char input
    if (!text) {
      const arr = digits.slice();
      arr[index] = "";
      onChange(arr.join(""));
      return;
    }

    const ch = text.replace(/\D/g, "").slice(-1);
    if (!ch) return;

    const arr = digits.slice();
    arr[index] = ch;
    const newVal = arr.join("");
    onChange(newVal);

    if (index < length - 1) {
      const next = inputs.current[index + 1];
      if (next) setTimeout(() => next.focus(), 0);
    } else {
      // last input: blur to dismiss keyboard focus and then trigger complete
      inputs.current[index]?.blur?.();
      if (newVal.length === length) onComplete?.(newVal);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key !== "Backspace") return;

    const arr = digits.slice();
    if (digits[index]) {
      // delete current digit
      arr[index] = "";
      onChange(arr.join(""));
      return;
    }

    // current empty -> move to previous and clear it
    if (index > 0) {
      const prev = inputs.current[index - 1];
      if (prev) {
        setTimeout(() => prev.focus(), 0);
      }
      arr[index - 1] = "";
      onChange(arr.join(""));
    }
  };

  return (
    <Animated.View
      style={[styles.otpContainer, { transform: [{ translateX: shakeAnim }] }]}
    >
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => (inputs.current[i] = r)}
          style={[styles.otpInput, digits[i] && styles.otpInputFilled]}
          keyboardType="number-pad"
          maxLength={1}
          value={digits[i]}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
        />
      ))}
    </Animated.View>
  );
}

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
  const newPassRef = useRef(null);

  const [seconds, setSeconds] = useState(60);

  const shakeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async (submittedOtp) => {
    const currentOtp = typeof submittedOtp === "string" ? submittedOtp : otp;

    if (!email || currentOtp.length !== 6 || !newPassword || !confirmPassword) {
      triggerShake();
      showAlert({
        title: "Error",
        message: "Please fill all fields correctly",
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
        otp: currentOtp.trim(),
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
        triggerShake();
        showAlert({
          title: "Error",
          message: res.message || "Invalid OTP",
          showCancel: false,
        });
      }
    } catch {
      triggerShake();
      showAlert({
        title: "Error",
        message: "Network error",
        showCancel: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setSeconds(60);
    setOtp("");
    await authAPI.forgotPassword(email);
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your email.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            editable={false}
          />

          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={(val) => {
              setOtp(val);
              // focus new password field when OTP complete
              newPassRef.current?.focus?.();
            }}
            shakeAnim={shakeAnim}
          />

          <View style={styles.resendRow}>
            {seconds > 0 ? (
              <Text style={styles.resendText}>Resend code in {seconds}s</Text>
            ) : (
              <TouchableOpacity onPress={resendOTP}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ position: "relative" }}>
            <TextInput
              ref={newPassRef}
              style={styles.input}
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  card: {
    backgroundColor: COLORS.white,
    margin: 24,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
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
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: COLORS.white, fontWeight: "700" },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  otpInput: {
    width: 46,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF",
  },
  resendRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  resendText: {
    color: COLORS.textMuted,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
