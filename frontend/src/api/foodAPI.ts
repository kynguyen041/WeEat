import { BASE_URL } from "./config";
import { AnalyzeImageResult, Food } from "./types";

export async function getAllFood(): Promise<Food[]> {
  const response = await fetch(`${BASE_URL}/food`);

  if (!response.ok) {
    throw new Error("Failed to fetch food");
  }

  const json = await response.json();

  return json.data.data;
}

export async function getFoodWithin(
  latitude: number,
  longitude: number,
  distance: number = 5,
  unit: "mi" | "km" = "mi",
): Promise<Food[]> {
  const response = await fetch(
    `${BASE_URL}/food/food_within/${distance}/center/${latitude},${longitude}/unit/${unit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }

  const json = await response.json();

  return json.data.data;
}

export async function getFood(id: string): Promise<Food> {
  const response = await fetch(`${BASE_URL}/food/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }

  const json = await response.json();

  return json.data.data;
}

export async function searchFood(keyword: string): Promise<Food[]> {
  const response = await fetch(
    `${BASE_URL}/food/search?keyword=${encodeURIComponent(keyword)}`,
  );

  if (!response.ok) {
    throw new Error("Search Failed");
  }

  const json = await response.json();

  return json.data.data;
}

/**
 * Uploads a food image to the AI analysis endpoint.
 * Requires a merchant/admin JWT.
 */
export async function analyzeFoodImage(
  image: { uri: string; mimeType: string; fileName: string },
  token: string,
): Promise<AnalyzeImageResult> {
  const formData = new FormData();

  // React Native's FormData accepts this file descriptor shape.
  formData.append("image", {
    uri: image.uri,
    type: image.mimeType,
    name: image.fileName,
  } as unknown as Blob);

  const response = await fetch(`${BASE_URL}/food/analyze-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type is intentionally omitted so RN sets the multipart boundary.
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Failed to analyze image");
  }

  return json.data;
}
