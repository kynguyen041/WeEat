import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    height: 70,
  },

  flex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },

  location: {
    marginTop: 6,
    fontSize: 15,
    color: "#777",
  },

  searchInput: {
    marginTop: 20,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  categoryContainer: {
    marginTop: 15,
  },

  categoryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  categoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginTop: 15,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },

  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  foodInfo: {
    flex: 1,
    marginLeft: 15,
  },

  foodName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  foodMeta: {
    marginTop: 6,
    color: "#777",
  },

  foodPrice: {
    marginTop: 8,
    color: "#FF6B35",
    fontSize: 18,
    fontWeight: "700",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },

  locationContainer: {
    flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    // marginHorizontal: 15,
  },

  locationText: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
});

export default styles;
