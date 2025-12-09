import { useState, useEffect } from "react";
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

export default function MenuScreen() {
  const {
    menuItems,
    categories,
    selectedCategory,
    fetchMenuItems,
    fetchCategories,
    setSelectedCategory,
  } = useMenuStore();
  const { addItem, getItemQuantity } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const {
    favorites = [],
    addFavorite,
    removeFavorite,
    loading: favLoading,
  } = useFavoritesStore();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMenuItem = ({ item }) => {
    const quantity = getItemQuantity(item._id);
    const isFavorite =
      Array.isArray(favorites) && favorites.some((fav) => fav._id === item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelected(item)}
        style={styles.menuItem}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text
              style={styles.itemName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.favoriteBtn}
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
            {item.description.length > 40
              ? item.description.slice(0, 40) + "..."
              : item.description}
          </Text>
          <View style={styles.itemMeta}>
            {item.isVegetarian && (
              <View style={styles.tag}>
                <Ionicons name="leaf" size={12} color={COLORS.success} />
                <Text style={styles.tagText}>Veg</Text>
              </View>
            )}
            <View style={styles.tag}>
              <Ionicons name="flame" size={12} color={COLORS.primary} />
              <Text style={styles.tagText}>{item.spiceLevel}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="time" size={12} color={COLORS.textMuted} />
              <Text style={styles.tagText}>{item.preparationTime} min</Text>
            </View>
          </View>
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>kr {item.price}</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => addItem(item)}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={styles.addToCartText}>Add</Text>
              {quantity > 0 && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // modal selection state
  const [selected, setSelected] = useState(null);

  const closeModal = () => setSelected(null);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
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
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
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

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />

      {/* Item detail modal */}
      <Modal visible={!!selected} animationType="slide" transparent={true}>
        <Pressable style={styles.modalOverlay} onPress={closeModal} />
        {selected && (
          <View style={styles.modalContent}>
            <Image source={{ uri: selected.image }} style={styles.modalImage} />
            <View style={styles.modalBody}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selected.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const isFav =
                      Array.isArray(favorites) &&
                      favorites.some((f) => f._id === selected._id);
                    isFav
                      ? removeFavorite(selected._id)
                      : addFavorite(selected._id);
                  }}
                >
                  <Ionicons
                    name={
                      Array.isArray(favorites) &&
                      favorites.some((f) => f._id === selected._id)
                        ? "heart"
                        : "heart-outline"
                    }
                    size={24}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalDesc}>{selected.description}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text style={styles.modalPrice}>kr {selected.price}</Text>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    addItem(selected);
                    closeModal();
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    paddingVertical: 0,
    color: COLORS.text,
  },
  categoriesContainer: {
    minHeight: 52,
    marginBottom: 8,
    paddingVertical: 6,
  },
  categoriesContent: {
    alignItems: "center",
    paddingHorizontal: 6,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 34,
    marginLeft: 12,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    color: COLORS.primary,
    paddingBottom: 2,
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
  listContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 120,
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  favoriteBtn: {
    marginLeft: 8,
    padding: 4,
    flexShrink: 0,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
    flexShrink: 1,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  quantityBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "15%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 10,
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  modalBody: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  modalDesc: {
    marginTop: 8,
    color: COLORS.textMuted,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 16,
  },
});
