import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  loading: {
    marginTop: 20,
  },

  emptyText: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },

  foodCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  name: {
    fontSize: 19,
    fontWeight: "700",
  },

  meta: {
    color: "#777",
    marginTop: 4,
  },

  restaurant: {
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },

  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B35",
  },
  backButton: {
    marginTop: 10,
    marginLeft: 16,
    marginBottom: 8,
  },
});
