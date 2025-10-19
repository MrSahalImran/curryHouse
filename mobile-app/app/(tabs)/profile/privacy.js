import { View, Text, StyleSheet } from "react-native";

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      {/* Add privacy policy content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
