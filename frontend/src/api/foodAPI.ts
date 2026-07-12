import { BASE_URL } from "./config";
import { Food } from "./types";

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
