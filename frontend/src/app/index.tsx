import { Text, View, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";

export default function Index() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
