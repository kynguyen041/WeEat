import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

/** Matches the backend's accepted formats and minimum resolution. */
const MIN_DIMENSION = 200;

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
}

type PermissionKind = "camera" | "library";

function permissionCopy(kind: PermissionKind) {
  return kind === "camera"
    ? {
        title: "Camera access needed",
        message:
          "WeEat needs camera access to take a photo of your food. You can enable it in Settings.",
      }
    : {
        title: "Photo access needed",
        message:
          "WeEat needs photo library access to select a food image. You can enable it in Settings.",
      };
}

/**
 * Requests the given permission, showing a Settings prompt if the user has
 * permanently denied it. Returns true only when access is granted.
 */
async function ensurePermission(kind: PermissionKind): Promise<boolean> {
  const result =
    kind === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (result.granted) return true;

  const { title, message } = permissionCopy(kind);

  // canAskAgain === false means the user blocked it; deep-link to Settings.
  if (!result.canAskAgain) {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]);
  } else {
    Alert.alert(title, message);
  }

  return false;
}

function normalizeAsset(
  asset: ImagePicker.ImagePickerAsset,
): PickedImage | null {
  if (asset.width < MIN_DIMENSION || asset.height < MIN_DIMENSION) {
    Alert.alert(
      "Image too small",
      `Please choose an image at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels.`,
    );
    return null;
  }

  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType ?? "image/jpeg",
    fileName: asset.fileName ?? `food-${Date.now()}.jpg`,
  };
}

/** Opens the camera. Returns null if cancelled or permission denied. */
export async function takeFoodPhoto(): Promise<PickedImage | null> {
  const granted = await ensurePermission("camera");
  if (!granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) return null;

  return normalizeAsset(result.assets[0]);
}

/** Opens the photo library. Returns null if cancelled or permission denied. */
export async function pickFoodPhoto(): Promise<PickedImage | null> {
  const granted = await ensurePermission("library");
  if (!granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) return null;

  return normalizeAsset(result.assets[0]);
}

/** Presents a Camera / Library choice, then returns the chosen image. */
export function chooseFoodPhoto(): Promise<PickedImage | null> {
  return new Promise((resolve) => {
    Alert.alert("Add a food photo", "Where would you like to get the image?", [
      { text: "Take Photo", onPress: () => takeFoodPhoto().then(resolve) },
      { text: "Choose from Library", onPress: () => pickFoodPhoto().then(resolve) },
      { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
    ]);
  });
}
