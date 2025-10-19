import { View, Text, StyleSheet } from "react-native";

export default function DeliveryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Addresses</Text>
      <Text style={styles.text}>
        Manage your saved delivery addresses here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
