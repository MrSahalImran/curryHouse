import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../config/config";
import { Ionicons } from "@expo/vector-icons";

import MapView, { Marker } from "react-native-maps";

const JAR_COORDS = {
  latitude: 59.929647,
  longitude: 10.620449,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Logo placeholder - replace source with your logo if available */}
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Curry House Jar</Text>
        <Text style={styles.subtitle}>Authentic Indian Takeaway in Bærum</Text>
        <Text style={styles.aboutText}>
          <Text style={styles.sectionHeader}>
            Our Awesome Street Food History{"\n"}
          </Text>
          Curry House Jar – En indisk takeaway drevet av erfarne kokker i Bærum.
          {"\n"}
          Nyt autentisk indisk mat på Jar! Bestill indisk takeaway nå!{"\n"}
          Nå har vi gleden av å annonsere at vi er åpne hver dag!
        </Text>
        <Text style={styles.mapTitle}>Find us here:</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={JAR_COORDS}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={JAR_COORDS}
              title="Curry House Jar"
              description="Vollsveien 76, 1358 Jar, Norway"
            />
          </MapView>
        </View>
        <TouchableOpacity
          style={styles.mapBtn}
          activeOpacity={0.85}
          onPress={() =>
            Linking.openURL(
              "https://www.google.com/maps/place/Vollsveien+76,+1358+Jar,+Norway/@59.929647,10.620449,17z"
            )
          }
        >
          <Ionicons name="location" size={20} color={COLORS.white} />
          <Text style={styles.mapBtnText}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 18,
    textAlign: "center",
    fontStyle: "italic",
  },
  aboutText: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 22,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionHeader: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: "center",
    marginTop: 8,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  mapBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
