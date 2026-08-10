import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },

  preview: {
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F4F4F4",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  previewEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  previewEmptyText: {
    color: "#AAA",
    fontSize: 14,
  },

  sourceRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  sourceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF6B35",
  },

  sourceButtonText: {
    color: "#FF6B35",
    fontWeight: "600",
    fontSize: 14,
  },

  analyzeButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
  },

  analyzeButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },

  analyzeButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FDECEA",
  },

  errorText: {
    flex: 1,
    color: "#C0392B",
    fontSize: 13,
  },

  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFF8E1",
  },

  warningText: {
    flex: 1,
    color: "#B8860B",
    fontSize: 13,
  },

  resultCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEE",
  },

  resultName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  resultConfidence: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },

  resultDescription: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  resultRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },

  resultLabel: {
    width: 110,
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  resultValue: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    textTransform: "capitalize",
  },
});
