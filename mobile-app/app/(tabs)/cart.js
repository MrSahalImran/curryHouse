import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../config/config";
import useCartStore from "../../store/cartStore";
import useOrderStore from "../../store/orderStore";
import useAddressStore from "../../store/addressStore";
import useAuthStore from "../../store/authStore";
import AuthPromptModal from "../components/AuthPromptModal";
import { useState, useEffect } from "react";

// Optional extras catalog (static for now)
const EXTRAS_OPTIONS = [
  { id: "extra-chicken", name: "Extra Chicken", price: 55 },
  { id: "ekstra-ris", name: "Ekstra Ris", price: 39 },
  { id: "mango-chutney", name: "Mango chutney", price: 25 },
  { id: "achar", name: "Achar", price: 25 },
  { id: "mint-raita-small", name: "Små mint raita", price: 20 },
  { id: "papaddum", name: "Papaddum med tilbehør", price: 35 },
  { id: "tandoori-saus", name: "Ekstra tandoori saus", price: 45 },
  { id: "mint-chutney", name: "Mint chutney", price: 25 },
  { id: "ekstra-salat", name: "Ekstra salat", price: 25 },
  { id: "garlic-naan", name: "Garlic Naan", price: 45 },
  { id: "plain-naan", name: "Plain Naan", price: 35 },
  { id: "pepsi-max", name: "Pepsi-Max", price: 35 },
  { id: "butter-naan", name: "Butter Naan", price: 49 },
  { id: "pashawari-naan", name: "Pashawari Naan", price: 55 },
  { id: "cola-05l", name: "Cola 0.5L", price: 35 },
  { id: "sprite-05l", name: "Sprite 0.5L", price: 35 },
  { id: "fanta-05l", name: "Fanta 0.5L", price: 35 },
  { id: "pepsi-05l", name: "Pepsi 0.5L", price: 35 },
  { id: "cola-zero-05l", name: "Cola Zero 0.5L", price: 35 },
];

// ✅ StyleSheet is now defined outside the component for better performance.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  listContainer: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  addressCardTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  addressCardText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  addressCardTextMuted: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  changeText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  defaultBadge: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textMuted,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalItemName: {
    fontSize: 16,
    color: COLORS.text,
  },
  modalItemPrice: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  modalTotal: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 20,
    marginBottom: 20,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  addressOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.surface,
  },
  addressText: {
    fontSize: 16,
  },
  noAddressText: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginVertical: 20,
  },
  manageAddressesLink: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
    fontWeight: "700",
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "500",
  },
  extrasContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  extraRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  extraName: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },
  extraPrice: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  extrasTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  extrasTotalLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  extrasTotalValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
  },
  notesSummary: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  notesSummaryText: {
    color: COLORS.text,
    marginTop: 4,
  },
});

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const { addresses, fetchAddresses } = useAddressStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [extraNotes, setExtraNotes] = useState("");
  const [extraSelections, setExtraSelections] = useState({});
  const [authPromptVisible, setAuthPromptVisible] = useState(false);

  const extrasTotal = Object.entries(extraSelections).reduce(
    (sum, [id, qty]) => {
      const opt = EXTRAS_OPTIONS.find((o) => o.id === id);
      return sum + (opt ? opt.price * qty : 0);
    },
    0
  );

  useEffect(() => {
    if (modalVisible) fetchAddresses();
  }, [modalVisible]);

  // Fetch addresses initially
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Preselect default address or first address when list changes
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress((prev) => prev || defaultAddr?._id);
    }
  }, [addresses]);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart first");
      return;
    }
    if (!user) {
      setAuthPromptVisible(true);
      return;
    }
    setModalVisible(true);
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setAuthPromptVisible(true);
      return;
    }
    if (!selectedAddress) {
      Alert.alert("Select Address", "Please select a delivery address.");
      return;
    }
    const extrasPicked = Object.entries(extraSelections)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const opt = EXTRAS_OPTIONS.find((o) => o.id === id);
        return {
          id,
          name: opt?.name || id,
          price: opt?.price || 0,
          quantity: qty,
          subtotal: (opt?.price || 0) * qty,
        };
      });
    const extrasTotalPayload = extrasPicked.reduce((s, e) => s + e.subtotal, 0);
    const orderData = {
      items: items.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: totalPrice + extrasTotalPayload,
      deliveryType: "delivery",
      paymentMethod: "cash",
      addressId: selectedAddress,
      specialInstructions: extraNotes,
      extras: extrasPicked,
      extrasTotal: extrasTotalPayload,
    };
    const result = await createOrder(orderData);
    setModalVisible(false);
    if (result.success) {
      clearCart();
      Alert.alert(
        "Order Placed!",
        `Your order #${result.order.orderNumber} has been placed successfully!`,
        [
          {
            text: "View Order",
            onPress: () => router.push("/orders"),
          },
          { text: "OK" },
        ]
      );
    } else {
      Alert.alert("Error", result.error || "Failed to place order");
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>kr {item.price}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(item._id)}
        >
          <Ionicons name="remove" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(item._id)}
        >
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item._id)}
      >
        <Ionicons name="trash" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.shopButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedAddrObj = addresses.find((a) => a._id === selectedAddress);
  const selectedAddrLine = selectedAddrObj
    ? `${selectedAddrObj.street}, ${selectedAddrObj.city} ${selectedAddrObj.postalCode}`
    : "No address selected";

  return (
    <View style={styles.container}>
      {/* Address summary */}
      <View style={styles.addressCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressCardTitle}>Deliver to</Text>
          <Text
            style={
              selectedAddrObj
                ? styles.addressCardText
                : styles.addressCardTextMuted
            }
          >
            {selectedAddrLine}
          </Text>
          {selectedAddrObj?.isDefault && (
            <Text style={styles.defaultBadge}>Default</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setStep(3);
          }}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total ({totalItems} items)</Text>
          <Text style={styles.totalPrice}>kr {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Place Order</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Modal Flow for Order Placement */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {step === 1 && (
                <>
                  <Text style={styles.modalTitle}>Order Summary</Text>
                  {items.map((item) => (
                    <View key={item._id} style={styles.modalItemRow}>
                      <Text style={styles.modalItemName}>
                        {item.name} x{item.quantity}
                      </Text>
                      <Text style={styles.modalItemPrice}>
                        kr {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                  <Text style={styles.modalTotal}>
                    Total: kr {totalPrice.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => setStep(2)}
                  >
                    <Text style={styles.nextBtnText}>Next: Add Extras</Text>
                  </TouchableOpacity>
                </>
              )}
              {step === 2 && (
                <>
                  <Text style={styles.modalTitle}>Add Extras / Notes</Text>
                  {/* Optional Extras */}
                  <View style={styles.extrasContainer}>
                    {EXTRAS_OPTIONS.map((opt) => {
                      const qty = extraSelections[opt.id] || 0;
                      return (
                        <View key={opt.id} style={styles.extraRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.extraName}>{opt.name}</Text>
                            <Text style={styles.extraPrice}>
                              kr {opt.price.toFixed(2)}
                            </Text>
                          </View>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() =>
                                setExtraSelections((prev) => ({
                                  ...prev,
                                  [opt.id]: Math.max(
                                    0,
                                    (prev[opt.id] || 0) - 1
                                  ),
                                }))
                              }
                            >
                              <Ionicons
                                name="remove"
                                size={20}
                                color={COLORS.primary}
                              />
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{qty}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() =>
                                setExtraSelections((prev) => ({
                                  ...prev,
                                  [opt.id]: (prev[opt.id] || 0) + 1,
                                }))
                              }
                            >
                              <Ionicons
                                name="add"
                                size={20}
                                color={COLORS.primary}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                    <View style={styles.extrasTotalRow}>
                      <Text style={styles.extrasTotalLabel}>Extras total</Text>
                      <Text style={styles.extrasTotalValue}>
                        kr{" "}
                        {Object.entries(extraSelections)
                          .reduce((sum, [id, qty]) => {
                            const opt = EXTRAS_OPTIONS.find((o) => o.id === id);
                            return sum + (opt ? opt.price * qty : 0);
                          }, 0)
                          .toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sectionHeading}>Additional Notes</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Any extra requests or notes? (optional)"
                    value={extraNotes}
                    onChangeText={setExtraNotes}
                    multiline
                  />
                  {/* Current totals (items + extras) */}
                  <View style={{ marginBottom: 12 }}>
                    <View style={styles.modalItemRow}>
                      <Text style={styles.modalItemName}>Items total</Text>
                      <Text style={styles.modalItemPrice}>
                        kr {totalPrice.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.modalItemRow}>
                      <Text style={styles.modalItemName}>Extras total</Text>
                      <Text style={styles.modalItemPrice}>
                        kr {extrasTotal.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.modalTotal}>
                      Current total: kr {(totalPrice + extrasTotal).toFixed(2)}
                    </Text>
                  </View>
                  {extraNotes?.trim()?.length ? (
                    <View style={styles.notesSummary}>
                      <Text style={styles.modalItemName}>Additional notes</Text>
                      <Text style={styles.notesSummaryText}>
                        {extraNotes.trim()}
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => setStep(3)}
                  >
                    <Text style={styles.nextBtnText}>Next: Select Address</Text>
                  </TouchableOpacity>
                </>
              )}
              {step === 3 && (
                <>
                  <Text style={styles.modalTitle}>Select Delivery Address</Text>
                  {addresses.length === 0 ? (
                    <Text style={styles.noAddressText}>
                      No addresses found. Add one in Profile.
                    </Text>
                  ) : (
                    <>
                      {addresses.map((addr) => (
                        <TouchableOpacity
                          key={addr._id}
                          style={[
                            styles.addressOption,
                            selectedAddress === addr._id &&
                              styles.addressSelected,
                          ]}
                          onPress={() => setSelectedAddress(addr._id)}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.addressText}>
                              {addr.street}, {addr.city} {addr.postalCode}
                            </Text>
                            {addr.isDefault && (
                              <Text style={styles.defaultPill}>Default</Text>
                            )}
                          </View>
                          {selectedAddress === addr._id && (
                            <Ionicons
                              name="checkmark-circle"
                              size={22}
                              color={COLORS.primary}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(false);
                          router.push("/profile/delivery");
                        }}
                      >
                        <Text style={styles.manageAddressesLink}>
                          Manage addresses
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {/* Final totals before placing order */}
                  <View style={{ marginTop: 12 }}>
                    <View style={styles.modalItemRow}>
                      <Text style={styles.modalItemName}>Items total</Text>
                      <Text style={styles.modalItemPrice}>
                        kr {totalPrice.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.modalItemRow}>
                      <Text style={styles.modalItemName}>Extras total</Text>
                      <Text style={styles.modalItemPrice}>
                        kr {extrasTotal.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.modalTotal}>
                      Final total: kr {(totalPrice + extrasTotal).toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={handlePlaceOrder}
                  >
                    <Text style={styles.nextBtnText}>Place Order</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <AuthPromptModal
        visible={authPromptVisible}
        onCancel={() => setAuthPromptVisible(false)}
        onLogin={() => {
          setAuthPromptVisible(false);
          setModalVisible(false);
          router.push("/login");
        }}
      />
    </View>
  );
}
