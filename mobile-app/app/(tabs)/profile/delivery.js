import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../config/config";

export default function DeliveryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Addresses Removed</Text>
      <Text style={styles.info}>
        The app no longer supports saved delivery addresses. Delivery address
        information is removed from orders.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, padding: 24 },
  title: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  info: { marginTop: 12, color: COLORS.textMuted, fontSize: 15 },
});
