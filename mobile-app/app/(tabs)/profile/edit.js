import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import useAuthStore from "../../../store/authStore";
import { COLORS } from "../../../config/config";
import { userAPI } from "../../../services/api";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await userAPI.updateProfile({ name, phone });
      if (res.success) {
        updateUser(res.user);
        Alert.alert("Profile updated!", "Your profile has been updated.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        setError(res.message || "Failed to update profile.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.avatarSection}>
        <Image source={{ uri: avatar || user?.avatar }} style={styles.avatar} />
        {/* Avatar upload/change can be added here */}
      </View>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Phone *</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={15}
      />
      {/* Avatar URL editing removed */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.text,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 4,
    backgroundColor: COLORS.white,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    width: "100%",
  },
  cancelBtn: {
    marginRight: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  error: {
    color: COLORS.error,
    marginBottom: 8,
    textAlign: "center",
    fontSize: 14,
  },
});
