import { AnalyzeImageResult } from "@/api/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { analyzeFoodImage } from "../api/foodAPI";
import styles from "../styles/AnalyzeFoodImageScreen.styles";
import {
  PickedImage,
  pickFoodPhoto,
  takeFoodPhoto,
} from "../utils/imagePicker";

export default function AnalyzeFoodImageScreen() {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [result, setResult] = useState<AnalyzeImageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setResult(null);
    setError(null);
  }

  async function handleTakePhoto() {
    reset();
    const picked = await takeFoodPhoto();
    if (picked) setImage(picked);
  }

  async function handlePickPhoto() {
    reset();
    const picked = await pickFoodPhoto();
    if (picked) setImage(picked);
  }

  async function handleAnalyze() {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: replace with the token from your auth store/context.
      const token = "";
      const data = await analyzeFoodImage(image, token);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const metadata = result?.foodMetadata;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#222" />
          </TouchableOpacity>

          <Text style={styles.title}>Analyze Food Photo</Text>

          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.subtitle}>
          Take or select a photo of a dish and let AI fill in the details.
        </Text>

        {/* Image preview */}
        <View style={styles.preview}>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.previewEmpty}>
              <Ionicons name="image-outline" size={48} color="#BBB" />
              <Text style={styles.previewEmptyText}>No image selected</Text>
            </View>
          )}
        </View>

        {/* Source buttons */}
        <View style={styles.sourceRow}>
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#FF6B35" />
            <Text style={styles.sourceButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sourceButton}
            onPress={handlePickPhoto}
          >
            <Ionicons name="images-outline" size={20} color="#FF6B35" />
            <Text style={styles.sourceButtonText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Analyze */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!image || loading) && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color="#C0392B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Low confidence warning */}
        {result?.lowConfidence && (
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={18} color="#B8860B" />
            <Text style={styles.warningText}>
              Low confidence result — please review the details carefully.
            </Text>
          </View>
        )}

        {/* Result */}
        {metadata && (
          <View style={styles.resultCard}>
            <Text style={styles.resultName}>{metadata.name}</Text>

            <Text style={styles.resultConfidence}>
              Confidence: {Math.round(metadata.confidence * 100)}%
            </Text>

            <Text style={styles.resultDescription}>{metadata.description}</Text>

            <ResultRow label="Cuisine" value={metadata.cuisine} />
            <ResultRow label="Category" value={metadata.category} />
            <ResultRow label="Calories" value={`${metadata.calories} kcal`} />
            <ResultRow label="Spice Level" value={`${metadata.spiceLevel} / 5`} />
            <ResultRow
              label="Ingredients"
              value={metadata.ingredients.join(", ")}
            />
            <ResultRow
              label="Allergens"
              value={
                metadata.allergens.length ? metadata.allergens.join(", ") : "None"
              }
            />
            <ResultRow
              label="Dietary Tags"
              value={
                metadata.dietaryTags.length
                  ? metadata.dietaryTags.join(", ")
                  : "None"
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}
