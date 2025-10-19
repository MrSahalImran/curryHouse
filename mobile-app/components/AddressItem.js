import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../config/config";

export default function AddressItem({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <View style={[styles.container, isDefault && styles.defaultContainer]}>
      <View style={styles.infoSection}>
        <Text style={styles.addressText}>
          {address.label || address.street}
        </Text>
        <Text style={styles.detailsText}>{address.street}</Text>
        <Text style={styles.detailsText}>
          {address.city}, {address.zip}
        </Text>
        {address.country && (
          <Text style={styles.detailsText}>{address.country}</Text>
        )}
      </View>
      <View style={styles.actionsSection}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={20} color={COLORS.info} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
        {onSetDefault && !isDefault && (
          <TouchableOpacity onPress={onSetDefault} style={styles.actionBtn}>
            <Ionicons name="star-outline" size={20} color={COLORS.warning} />
          </TouchableOpacity>
        )}
        {isDefault && (
          <Ionicons
            name="star"
            size={20}
            color={COLORS.warning}
            style={styles.defaultStar}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  defaultContainer: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.surface,
  },
  infoSection: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  actionsSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 4,
  },
  defaultStar: {
    marginLeft: 8,
  },
});
