const { GoogleGenerativeAI } = require("@google/generative-ai");
const AppError = require("./AppError");

// --- Enums (aligned with foodModel.js) ---
const CUISINES = [
  "japanese",
  "korean",
  "thai",
  "vietnamese",
  "chinese",
  "italian",
  "american",
  "indian",
  "mexican",
];

const CATEGORIES = [
  "burger",
  "chicken",
  "pizza",
  "rice bowl",
  "noodles",
  "dessert",
  "drink",
  "salad",
  "soup",
];

const DIETARY_TAGS = [
  "vegan",
  "vegetarian",
  "halal",
  "gluten_free",
  "dairy_free",
  "nut_free",
];

// --- Configuration ---
const TIMEOUT_MS = 30000;

function assertConfigured() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
}

function getClient() {
  assertConfigured();
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// --- Prompt ---
function buildPrompt() {
  return `Analyze this food image and return ONLY a JSON object with the following fields. Do not include any text outside the JSON.

{
  "foodDetected": boolean,
  "name": "string (max 100 chars)",
  "description": "string (max 500 chars)",
  "ingredients": ["string"],
  "allergens": ["string"],
  "dietaryTags": [${DIETARY_TAGS.map((t) => `"${t}"`).join(", ")}],
  "cuisine": one of [${CUISINES.map((c) => `"${c}"`).join(", ")}],
  "category": one of [${CATEGORIES.map((c) => `"${c}"`).join(", ")}],
  "calories": positive integer,
  "spiceLevel": integer 0-5,
  "confidence": number 0.0-1.0
}

If the image does not contain food, set "foodDetected" to false and leave other fields empty/default.
Return ONLY the JSON object, no markdown, no explanation.`;
}

// --- Analyze (I/O boundary) ---
async function analyze({ buffer, format }) {
  assertConfigured();

  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const mimeMap = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
  const mimeType = mimeMap[format] || "image/jpeg";

  const imagePart = {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await model.generateContent(
      [buildPrompt(), imagePart],
      { signal: controller.signal },
    );

    clearTimeout(timer);

    const response = result.response;
    const text = response.text();

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new AppError(
        "AI service is currently unavailable, please try again later",
        502,
      );
    }
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof AppError) throw err;

    if (err.name === "AbortError" || controller.signal.aborted) {
      throw new AppError("AI analysis timed out, please try again", 504);
    }

    throw new AppError(
      "AI service is currently unavailable, please try again later",
      502,
    );
  }
}

// --- Parse and Validate (pure, deterministic) ---
function parseAndValidate(raw) {
  if (!raw || typeof raw !== "object") {
    throw new AppError(
      "Unable to extract food information from this image",
      422,
    );
  }

  // Food detection check
  if (raw.foodDetected === false) {
    throw new AppError(
      "No food item could be identified in the image",
      422,
    );
  }

  // Name
  let name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length > 100) name = name.slice(0, 100);
  if (!name) {
    throw new AppError(
      "Unable to extract food information from this image",
      422,
    );
  }

  // Description
  let description = typeof raw.description === "string" ? raw.description.trim() : "";
  if (description.length > 500) description = description.slice(0, 500);

  // Ingredients
  let ingredients = [];
  if (Array.isArray(raw.ingredients)) {
    ingredients = raw.ingredients
      .filter((i) => typeof i === "string" && i.trim().length > 0)
      .map((i) => i.trim());
  }
  if (ingredients.length < 1) {
    throw new AppError(
      "Unable to extract food information from this image",
      422,
    );
  }

  // Allergens
  let allergens = [];
  if (Array.isArray(raw.allergens)) {
    allergens = raw.allergens
      .filter((a) => typeof a === "string" && a.trim().length > 0)
      .map((a) => a.trim());
  }

  // Dietary tags
  let dietaryTags = [];
  if (Array.isArray(raw.dietaryTags)) {
    const seen = new Set();
    for (const tag of raw.dietaryTags) {
      const normalized = typeof tag === "string" ? tag.trim().toLowerCase() : "";
      if (DIETARY_TAGS.includes(normalized) && !seen.has(normalized)) {
        seen.add(normalized);
        dietaryTags.push(normalized);
      }
    }
  }

  // Cuisine
  const cuisineRaw = typeof raw.cuisine === "string" ? raw.cuisine.trim().toLowerCase() : "";
  if (!CUISINES.includes(cuisineRaw)) {
    throw new AppError(
      "Unable to extract food information from this image",
      422,
    );
  }
  const cuisine = cuisineRaw;

  // Category
  const categoryRaw = typeof raw.category === "string" ? raw.category.trim().toLowerCase() : "";
  if (!CATEGORIES.includes(categoryRaw)) {
    throw new AppError(
      "Unable to extract food information from this image",
      422,
    );
  }
  const category = categoryRaw;

  // Calories
  let calories = parseInt(raw.calories, 10);
  if (isNaN(calories) || calories < 0) calories = 0;

  // Spice level
  let spiceLevel = parseInt(raw.spiceLevel, 10);
  if (isNaN(spiceLevel)) spiceLevel = 0;
  spiceLevel = Math.max(0, Math.min(5, spiceLevel));

  // Confidence
  let confidence = parseFloat(raw.confidence);
  if (isNaN(confidence)) confidence = 0;
  confidence = Math.max(0, Math.min(1, confidence));
  confidence = Math.round(confidence * 100) / 100;

  return {
    name,
    description,
    ingredients,
    allergens,
    dietaryTags,
    cuisine,
    category,
    calories,
    spiceLevel,
    confidence,
  };
}

module.exports = {
  assertConfigured,
  analyze,
  parseAndValidate,
  CUISINES,
  CATEGORIES,
  DIETARY_TAGS,
};
