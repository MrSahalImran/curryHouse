import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import useFavoritesStore from "../../../store/favoritesStore";
import FavoriteItem from "../../../components/FavoriteItem";
import { COLORS } from "../../../config/config";

export default function FavoritesScreen() {
  const { favorites, loading, error, fetchFavorites, removeFavorite } =
    useFavoritesStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = (itemId) => {
    Alert.alert("Remove Favorite", "Remove this dish from your favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFavorite(itemId),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 24 }}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FavoriteItem item={item} onRemove={() => handleRemove(item._id)} />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No favorites yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    color: COLORS.text,
    textAlign: "center",
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
});
