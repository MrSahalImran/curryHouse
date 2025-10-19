import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../config/config";

export default function FavoriteItem({ item, onRemove }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>kr {item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="heart-dislike" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 14,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  removeBtn: {
    marginLeft: 10,
    padding: 6,
  },
});
