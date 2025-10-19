import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../config/config";
import useOrderStore from "../../store/orderStore";

const STATUS_CONFIG = {
  pending: { icon: "time", color: COLORS.warning, label: "Pending" },
  confirmed: {
    icon: "checkmark-circle",
    color: COLORS.info,
    label: "Confirmed",
  },
  preparing: {
    icon: "restaurant",
    color: COLORS.secondary,
    label: "Preparing",
  },
  ready: { icon: "checkmark-done", color: COLORS.success, label: "Ready" },
  on_the_way: { icon: "bicycle", color: COLORS.primary, label: "On the way" },
  delivered: {
    icon: "checkmark-circle",
    color: COLORS.success,
    label: "Delivered",
  },
  cancelled: { icon: "close-circle", color: COLORS.error, label: "Cancelled" },
};

export default function OrdersScreen() {
  const { orders, fetchOrders, isLoading } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item: order }) => {
    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString("no-NO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.color + "20" },
            ]}
          >
            <Ionicons
              name={statusInfo.icon}
              size={16}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>kr {item.subtotal}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.deliveryInfo}>
            <Ionicons
              name={order.deliveryType === "delivery" ? "bicycle" : "bag-check"}
              size={16}
              color={COLORS.textLight}
            />
            <Text style={styles.deliveryText}>
              {order.deliveryType === "delivery" ? "Delivery" : "Pickup"}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>kr {order.totalAmount}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (orders.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={100} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySubtext}>
          Your order history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={fetchOrders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
