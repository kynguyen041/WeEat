const sharp = require("sharp");
const { validateImage } = require("../utils/imageProcessor");

describe("imageProcessor.validateImage", () => {
  // Helper to create a valid test image buffer
  async function makeImage(format = "png", width = 300, height = 300) {
    const buffer = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .toFormat(format)
      .toBuffer();
    return { buffer, mimetype: `image/${format}`, size: buffer.length };
  }

  test("accepts a valid PNG image", async () => {
    const file = await makeImage("png", 400, 400);
    const result = await validateImage(file);
    expect(result.format).toBe("png");
    expect(result.width).toBe(400);
    expect(result.height).toBe(400);
  });

  test("accepts a valid JPEG image", async () => {
    const file = await makeImage("jpeg", 500, 500);
    const result = await validateImage(file);
    expect(result.format).toBe("jpeg");
  });

  test("accepts a valid WebP image", async () => {
    const file = await makeImage("webp", 250, 250);
    const result = await validateImage(file);
    expect(result.format).toBe("webp");
  });

  test("rejects missing file", async () => {
    await expect(validateImage(undefined)).rejects.toThrow(
      "An image file is required.",
    );
    await expect(validateImage(null)).rejects.toThrow(
      "An image file is required.",
    );
  });

  test("rejects file exceeding 10 MB", async () => {
    // Create a buffer slightly over 10MB
    const bigBuffer = Buffer.alloc(10 * 1024 * 1024 + 1);
    const file = { buffer: bigBuffer, mimetype: "image/png", size: bigBuffer.length };
    await expect(validateImage(file)).rejects.toThrow(
      "Image exceeds the maximum allowed size of 10 MB.",
    );
  });

  test("rejects non-image buffer", async () => {
    const file = {
      buffer: Buffer.from("this is not an image"),
      mimetype: "image/png",
      size: 20,
    };
    await expect(validateImage(file)).rejects.toThrow(
      "The uploaded file is not a readable image.",
    );
  });

  test("rejects image with dimensions below 200x200", async () => {
    const file = await makeImage("png", 100, 100);
    await expect(validateImage(file)).rejects.toThrow(
      "Image resolution must be at least 200x200 pixels.",
    );
  });

  test("rejects unsupported format (GIF content)", async () => {
    const file = await makeImage("gif", 300, 300);
    await expect(validateImage(file)).rejects.toThrow(
      "Unsupported format. Accepted formats: JPEG, PNG, WebP.",
    );
  });
});
