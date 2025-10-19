import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../config/config";

export default function AddressForm({ initial, onSubmit, onCancel, loading }) {
  const [label, setLabel] = useState(initial?.label || "");
  const [street, setStreet] = useState(initial?.street || "");
  const [city, setCity] = useState(initial?.city || "");
  const [zip, setZip] = useState(initial?.zip || "");
  const [country, setCountry] = useState(initial?.country || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!street.trim() || !city.trim() || !zip.trim()) {
      setError("Street, city, and ZIP code are required.");
      return;
    }
    setError("");
    onSubmit({ label, street, city, zip, country });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Label (e.g. Home, Work)</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={(text) => setLabel(text)}
        placeholder="Label"
      />
      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        value={street}
        onChangeText={(text) => setStreet(text)}
        placeholder="Street"
        required
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={(text) => setCity(text)}
        placeholder="City"
        required
      />
      <Text style={styles.label}>ZIP Code</Text>
      <TextInput
        style={styles.input}
        value={zip}
        onChangeText={(text) => setZip(text)}
        placeholder="ZIP Code"
        required
      />
      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={(text) => setCountry(text)}
        placeholder="Country"
        required
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 4,
    backgroundColor: COLORS.surface,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelBtn: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
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
