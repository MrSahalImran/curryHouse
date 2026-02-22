import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../config/config";
import useMenuStore from "../../store/menuStore";
import useCartStore from "../../store/cartStore";
import useFavoritesStore from "../../store/favoritesStore";

const truncateText = (value, maxLength) => {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

export default function MenuScreen() {
  const {
    menuItems,
    categories,
    selectedCategory,
    fetchMenuItems,
    fetchCategories,
    setSelectedCategory,
  } = useMenuStore();

  const { addItem, getItemQuantity, increaseQuantity, decreaseQuantity } =
    useCartStore();
  const {
    favorites = [],
    addFavorite,
    removeFavorite,
    loading: favLoading,
  } = useFavoritesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const categoriesScrollRef = useRef(null);
  const categoriesScrollXRef = useRef(0);

  const restoreCategoriesScroll = () => {
    requestAnimationFrame(() => {
      categoriesScrollRef.current?.scrollTo({
        x: categoriesScrollXRef.current,
        animated: false,
      });
    });
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    restoreCategoriesScroll();
  }, [selectedCategory]);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ---------------- HEADER (ZOMATO STYLE) ---------------- */

  const ListHeader = useCallback(
    () => (
      <View>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          ref={categoriesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categoriesContainer}
          onScroll={(e) => {
            categoriesScrollXRef.current = e.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory(category);
                restoreCategoriesScroll();
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ),
    [searchQuery, selectedCategory, categories],
  );

  /* ---------------- MENU ITEM ---------------- */

  const renderMenuItem = ({ item }) => {
    const quantity = getItemQuantity(item._id);
    const isFavorite = favorites.some((f) => f._id === item._id);
    const uri = item.image || "https://via.placeholder.com/300x200";
    // Spice level color mapping
    const spice = (item.spiceLevel || "Medium").toString();
    const SPICE_COLORS = {
      Mild: { bg: "#E8F5E9", icon: COLORS.success, text: "#2E7D32" },
      Medium: { bg: "#FFF3E0", icon: COLORS.primary, text: "#E65100" },
      Hot: { bg: "#FFEBEE", icon: "#D32F2F", text: "#C62828" },
      "Extra Hot": { bg: "#F3E5F5", icon: "#7B1FA2", text: "#6A1B9A" },
    };
    const spiceStyle = SPICE_COLORS[spice] || SPICE_COLORS.Medium;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.menuItem}
        onPress={() => setSelected(item)}
      >
        <Image source={{ uri }} style={styles.itemImage} />

        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1}>
              {truncateText(item.name, 20)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                isFavorite ? removeFavorite(item._id) : addFavorite(item._id)
              }
              disabled={favLoading}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? COLORS.error : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemDescription} numberOfLines={1}>
            {truncateText(item.description, 42)}
          </Text>

          <View style={styles.itemMeta}>
            <View style={[styles.tag, { backgroundColor: spiceStyle.bg }]}>
              <Ionicons name="flame" size={12} color={spiceStyle.icon} />
              <Text style={[styles.tagText, { color: spiceStyle.text }]}>
                {item.spiceLevel}
              </Text>
            </View>
          </View>

          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>kr {item.price}</Text>
            {quantity > 0 ? (
              <View style={styles.cartControls}>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => decreaseQuantity(item._id)}
                >
                  <Ionicons name="remove" size={16} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.ctrlQty}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => increaseQuantity(item._id)}
                >
                  <Ionicons name="add" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => addItem(item)}
              >
                <Ionicons name="add" size={18} color={COLORS.white} />
                <Text style={styles.addToCartText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />

      {/* MODAL */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelected(null)}
        />
        {selected && (
          <View style={styles.modalContent}>
            <Image
              source={{
                uri: selected.image || "https://via.placeholder.com/600x400",
              }}
              style={styles.modalImage}
            />
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{selected.name}</Text>
              <Text style={styles.modalDesc}>{selected.description}</Text>
              <View style={styles.modalFooter}>
                <Text style={styles.modalPrice}>kr {selected.price}</Text>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    addItem(selected);
                    setSelected(null);
                  }}
                >
                  <Ionicons name="add" size={18} color={COLORS.white} />
                  <Text style={styles.addToCartText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },

  categoriesContainer: { marginBottom: 20, marginTop: 8 },
  categoriesContent: { paddingHorizontal: 4 },

  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: { color: COLORS.primary, fontWeight: "600" },
  categoryTextActive: { color: COLORS.white },

  menuItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },

  itemImage: { width: 120, height: "100%" },

  itemDetails: { flex: 1, padding: 12 },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: { fontSize: 16, fontWeight: "700" },
  itemDescription: { fontSize: 12, color: COLORS.textLight, marginBottom: 6 },

  itemMeta: { flexDirection: "row", marginBottom: 6 },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },

  tagText: { fontSize: 10, marginLeft: 2 },

  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemPrice: { fontSize: 18, fontWeight: "700", color: COLORS.primary },

  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addToCartText: { color: COLORS.white, marginLeft: 4 },

  quantityBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: { color: COLORS.white, fontSize: 10 },

  /* rectangular cart controls */
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctrlBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 7.2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlQty: {
    marginHorizontal: 6,
    fontSize: 14,
    color: COLORS.text,
    minWidth: 14,
    textAlign: "center",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: { marginTop: 12, color: COLORS.textMuted },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },

  modalContent: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "15%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
  },

  modalImage: { width: "100%", height: 180 },

  modalBody: { padding: 16 },

  modalTitle: { fontSize: 18, fontWeight: "700" },

  modalDesc: { marginVertical: 8, color: COLORS.textMuted },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalPrice: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
});
