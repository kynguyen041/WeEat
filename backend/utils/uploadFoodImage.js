const multer = require("multer");
const AppError = require("./AppError");

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Unsupported format. Accepted formats: JPEG, PNG, WebP.",
        400,
      ),
      false,
    );
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

exports.uploadFoodImage = upload.single("image");
