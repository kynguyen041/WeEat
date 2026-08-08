const { parseAndValidate } = require("../utils/geminiService");

describe("geminiService.parseAndValidate", () => {
  const validRaw = {
    foodDetected: true,
    name: "Spicy Miso Ramen",
    description: "A bowl of ramen with miso broth and pork",
    ingredients: ["noodles", "miso", "pork"],
    allergens: ["gluten", "soy"],
    dietaryTags: ["halal"],
    cuisine: "Japanese",
    category: "Noodles",
    calories: 650,
    spiceLevel: 3,
    confidence: 0.87,
  };

  test("returns valid Food_Metadata for a well-formed AI response", () => {
    const result = parseAndValidate(validRaw);

    expect(result.name).toBe("Spicy Miso Ramen");
    expect(result.description).toBe("A bowl of ramen with miso broth and pork");
    expect(result.ingredients).toEqual(["noodles", "miso", "pork"]);
    expect(result.allergens).toEqual(["gluten", "soy"]);
    expect(result.dietaryTags).toEqual(["halal"]);
    expect(result.cuisine).toBe("japanese");
    expect(result.category).toBe("noodles");
    expect(result.calories).toBe(650);
    expect(result.spiceLevel).toBe(3);
    expect(result.confidence).toBe(0.87);
  });

  test("throws 422 when foodDetected is false", () => {
    expect(() => parseAndValidate({ ...validRaw, foodDetected: false })).toThrow(
      "No food item could be identified in the image",
    );
  });

  test("throws 422 when name is missing", () => {
    expect(() => parseAndValidate({ ...validRaw, name: "" })).toThrow(
      "Unable to extract food information from this image",
    );
  });

  test("throws 422 when ingredients is empty", () => {
    expect(() => parseAndValidate({ ...validRaw, ingredients: [] })).toThrow(
      "Unable to extract food information from this image",
    );
  });

  test("throws 422 when cuisine is not in enum", () => {
    expect(() => parseAndValidate({ ...validRaw, cuisine: "martian" })).toThrow(
      "Unable to extract food information from this image",
    );
  });

  test("throws 422 when category is not in enum", () => {
    expect(() =>
      parseAndValidate({ ...validRaw, category: "spacefood" }),
    ).toThrow("Unable to extract food information from this image");
  });

  test("truncates name to 100 chars", () => {
    const longName = "A".repeat(150);
    const result = parseAndValidate({ ...validRaw, name: longName });
    expect(result.name.length).toBe(100);
  });

  test("truncates description to 500 chars", () => {
    const longDesc = "B".repeat(600);
    const result = parseAndValidate({ ...validRaw, description: longDesc });
    expect(result.description.length).toBe(500);
  });

  test("clamps spiceLevel to [0, 5]", () => {
    expect(parseAndValidate({ ...validRaw, spiceLevel: -2 }).spiceLevel).toBe(0);
    expect(parseAndValidate({ ...validRaw, spiceLevel: 10 }).spiceLevel).toBe(5);
  });

  test("clamps calories to >= 0", () => {
    expect(parseAndValidate({ ...validRaw, calories: -100 }).calories).toBe(0);
  });

  test("clamps confidence to [0, 1] and rounds to 2 decimals", () => {
    expect(parseAndValidate({ ...validRaw, confidence: 1.5 }).confidence).toBe(1);
    expect(parseAndValidate({ ...validRaw, confidence: -0.5 }).confidence).toBe(0);
    expect(parseAndValidate({ ...validRaw, confidence: 0.876 }).confidence).toBe(0.88);
  });

  test("drops invalid dietary tags and deduplicates", () => {
    const result = parseAndValidate({
      ...validRaw,
      dietaryTags: ["vegan", "invalid_tag", "Vegan", "halal"],
    });
    expect(result.dietaryTags).toEqual(["vegan", "halal"]);
  });

  test("throws 422 for null input", () => {
    expect(() => parseAndValidate(null)).toThrow(
      "Unable to extract food information from this image",
    );
  });
});
