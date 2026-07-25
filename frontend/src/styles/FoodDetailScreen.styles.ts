import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: "100%",
    height: 300,
  },

  content: {
    padding: 20,
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#222",
  },

  rating: {
    marginTop: 12,
    fontSize: 18,
    color: "#666",
  },

  orders: {
    marginTop: 6,
    fontSize: 18,
    color: "#666",
  },

  descriptionTitle: {
    marginTop: 25,
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: 28,
    color: "#555",
  },

  addButton: {
    marginTop: 35,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  screen: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
});

export default styles;
