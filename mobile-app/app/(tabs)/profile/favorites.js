import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import useFavoritesStore from "../../../store/favoritesStore";
import AlertModal from "../../../components/AlertModal";
import FavoriteItem from "../../../components/FavoriteItem";
import { COLORS } from "../../../config/config";

export default function FavoritesScreen() {
  const { favorites, loading, error, fetchFavorites, removeFavorite } =
    useFavoritesStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = (itemId) => {
    setAlertTitle("Remove Favorite");
    setAlertMessage("Remove this dish from your favorites?");
    setAlertConfirm(() => () => removeFavorite(itemId));
    setAlertVisible(true);
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => () => {});

  return (
    <View style={styles.container}>
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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No favorites yet.</Text>
        }
      />
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        showCancel={true}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => {
          setAlertVisible(false);
          alertConfirm();
        }}
        confirmText={"Remove"}
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
