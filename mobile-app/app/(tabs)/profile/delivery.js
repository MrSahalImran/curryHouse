import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAddressStore from "../../../store/addressStore";
import AddressItem from "../../../components/AddressItem";
import AddressForm from "../../../components/AddressForm";
import { COLORS } from "../../../config/config";

export default function DeliveryScreen() {
  const {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressStore();
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAddress(id);
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
  };

  const handleFormSubmit = async (data) => {
    if (editAddress) {
      await updateAddress(editAddress._id, data);
    } else {
      await addAddress(data);
    }
    setShowForm(false);
    setEditAddress(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditAddress(null);
  };

  const renderItem = ({ item }) => (
    <AddressItem
      address={item}
      isDefault={item.isDefault}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item._id)}
      onSetDefault={() => handleSetDefault(item._id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Addresses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 24 }}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 8 }}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No addresses found.</Text>
        }
      />
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AddressForm
              initial={editAddress}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={loading}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addBtnText: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 16,
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginVertical: 8,
  },
  empty: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
