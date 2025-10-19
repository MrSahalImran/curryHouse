import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RESTAURANT_INFO } from "../../config/config";
import useMenuStore from "../../store/menuStore";
import useCartStore from "../../store/cartStore";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { popularItems, fetchPopularItems } = useMenuStore();
  const { addItem } = useCartStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerImages = [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
  ];

  useEffect(() => {
    fetchPopularItems();

    // Auto-slide banner
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: bannerImages[currentBannerIndex] }}
          style={styles.banner}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Welcome to</Text>
          <Text style={styles.bannerSubtitle}>{RESTAURANT_INFO.name}</Text>
          <Text style={styles.bannerDescription}>
            {RESTAURANT_INFO.description}
          </Text>
        </View>

        {/* Banner Indicators */}
        <View style={styles.indicators}>
          {bannerImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentBannerIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{RESTAURANT_INFO.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{RESTAURANT_INFO.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>Open Daily - 14:00 - 22:00</Text>
        </View>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Ionicons name="flash" size={32} color={COLORS.primary} />
          <Text style={styles.featureTitle}>Express Delivery</Text>
          <Text style={styles.featureText}>Fast & Hot</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="bag-check" size={32} color={COLORS.primary} />
          <Text style={styles.featureTitle}>Takeaway</Text>
          <Text style={styles.featureText}>Pick up available</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="pricetag" size={32} color={COLORS.primary} />
          <Text style={styles.featureTitle}>Discounts</Text>
          <Text style={styles.featureText}>For regulars</Text>
        </View>
      </View>

      {/* Popular Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chef's Special</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {popularItems.map((item) => (
            <View key={item._id} style={styles.menuCard}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuInfo}>
                <Text style={styles.menuName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.menuDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.menuFooter}>
                  <Text style={styles.menuPrice}>kr {item.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addItem(item)}
                  >
                    <Ionicons name="add" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    position: "relative",
    height: 250,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bannerTitle: {
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: "center",
  },
  indicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.white,
    width: 24,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  menuCard: {
    width: 200,
    height: 260,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  menuImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  menuInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  menuName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    height: 32,
  },
  menuFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
