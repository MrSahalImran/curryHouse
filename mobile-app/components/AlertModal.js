import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../config/config";

export default function AlertModal({
  visible,
  title = "",
  message = "",
  onCancel = () => {},
  onConfirm = () => {},
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            {showCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 12,
  },
  cancelBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    flex: 1,
    alignItems: "center",
  },
  cancelText: { color: COLORS.text, fontWeight: "600" },
  confirmBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flex: 1,
    alignItems: "center",
  },
  confirmText: { color: COLORS.white, fontWeight: "700" },
});
