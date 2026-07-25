import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  cartCard: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    fontSize: 16,
    marginTop: 5,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
  },

  removeText: {
    marginTop: 8,
    color: "red",
  },

  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },

  orderButton: {
    backgroundColor: "#FF6B35",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 15,
    fontSize: 20,
    color: "#999",
  },
});
