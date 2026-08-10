const sharp = require("sharp");
const AppError = require("./AppError");

const ALLOWED_FORMATS = ["jpeg", "png", "webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MIN_DIMENSION = 200;

/**
 * Validates an uploaded image file (in-memory buffer).
 * Pure async function — no network or disk side effects.
 *
 * @param {{ buffer: Buffer, mimetype: string, size: number } | undefined} file
 * @returns {Promise<{ format: "jpeg"|"png"|"webp", width: number, height: number }>}
 * @throws {AppError} 400 on any validation failure
 */
async function validateImage(file) {
  // 1. Missing file
  if (!file || !file.buffer) {
    throw new AppError("An image file is required.", 400);
  }

  // 2. Size check
  const size = file.buffer.length;
  if (size > MAX_SIZE) {
    throw new AppError("Image exceeds the maximum allowed size of 10 MB.", 400);
  }

  // 3. Format sniffing + decode via sharp
  let metadata;
  try {
    metadata = await sharp(file.buffer).metadata();
  } catch {
    throw new AppError("The uploaded file is not a readable image.", 400);
  }

  // 4. Format validation (by actual content, not mimetype)
  const format = metadata.format; // e.g. "jpeg", "png", "webp"
  if (!format || !ALLOWED_FORMATS.includes(format)) {
    throw new AppError(
      "Unsupported format. Accepted formats: JPEG, PNG, WebP.",
      400,
    );
  }

  // 5. Dimension check
  const { width, height } = metadata;
  if (!width || !height || width < MIN_DIMENSION || height < MIN_DIMENSION) {
    throw new AppError(
      "Image resolution must be at least 200x200 pixels.",
      400,
    );
  }

  return { format, width, height };
}

module.exports = { validateImage };
