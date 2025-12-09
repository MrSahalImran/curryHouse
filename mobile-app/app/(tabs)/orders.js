import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../config/config";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";

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
  cancelled: { icon: "close-circle", color: COLORS.error, label: "Cancelled" },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { orders, fetchOrders, isLoading, clearOrders } = useOrderStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      clearOrders();
    }
  }, [isAuthenticated]);

  const renderOrderItem = ({ item: order }) => {
    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text
              style={styles.orderNumber}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Order #{order.orderNumber}
            </Text>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.extras && item.extras.length > 0 ? (
                  <View style={styles.extrasRow}>
                    {item.extras.map((e, ei) => (
                      <View key={ei} style={styles.extraPill}>
                        <Text style={styles.extraPillText} numberOfLines={1} ellipsizeMode="tail">{e.name || e.id || e}{e.quantity ? ` x${e.quantity}` : ''}</Text>
                        <Text style={styles.extraPillPrice}>kr { (e.subtotal ?? (e.price && e.quantity ? e.price*e.quantity : e.price || 0)) }</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
              <Text style={styles.itemPrice}>kr {item.subtotal}</Text>
            </View>
          ))}

          {/* Order-level extras (picked during checkout) */}
          {order.extras && order.extras.length > 0 ? (
            <View style={styles.orderExtras}>
              <Text style={styles.sectionHeading}>Extras</Text>
              <View style={styles.extrasRow}>
                {order.extras.map((ex, i) => (
                  <View key={i} style={styles.extraPillFull}>
                    <Text style={styles.extraPillText}>{ex.name || ex.id}{ex.quantity ? ` x${ex.quantity}` : ''}</Text>
                    <Text style={styles.extraPillPrice}>kr { (ex.subtotal ?? (ex.price && ex.quantity ? ex.price*ex.quantity : ex.price || 0)) }</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>Pickup</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>kr {order.totalAmount}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="lock-closed" size={100} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Please sign in</Text>
        <Text style={styles.emptySubtext}>
          Log in to view your orders and tracking
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  orderHeaderLeft: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
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
    flexShrink: 0,
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
  loginButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  // Extras styling
  extrasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  extraPill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  extraPillFull: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
    marginTop: 6,
    minWidth: 120,
  },
  extraPillText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 6,
  },
  extraPillPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  orderExtras: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
});
