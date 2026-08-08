# WeEat Backend

Node.js / Express REST API for the WeEat food delivery app.

## Setup

```bash
npm install
```

Create a `.env` file (see root [README](../README.md#backend-setup) for required variables). To enable the AI food image analysis feature, also set:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start the server in development mode (nodemon) |
| `npm run start:prod` | Start the server in production mode (nodemon) |
| `npm test` | Run the Jest test suite |
| `npm run debug` | Start the server with `ndb` for debugging |

## Project Structure

```
backend/
├── app.js                         # Express app config, middleware stack, route mounting
├── server.js                      # Entry point — connects MongoDB, starts Express server
├── controllers/
│   ├── authController.js          # Signup, login, protect, password reset
│   ├── foodController.js          # Food CRUD, search, geospatial, stats, AI image analysis
│   ├── userController.js          # User profile, updateMe, deleteMe
│   ├── reviewController.js        # Review CRUD
│   ├── handlerFactory.js          # Generic CRUD factory functions
│   └── errorController.js         # Global error handler (incl. Multer error normalization)
├── model/
│   ├── foodModel.js                # Food schema (GeoJSON, text index, virtuals)
│   ├── userModel.js                # User schema (roles, addresses, password hashing)
│   └── reviewModel.js              # Review schema (auto rating calculation)
├── routes/
│   ├── foodRoutes.js               # /api/v1/food endpoints (incl. /analyze-image)
│   ├── userRoutes.js               # /api/v1/user endpoints
│   └── reviewRoutes.js             # /api/v1/reviews endpoints
├── utils/
│   ├── apiFeature.js               # Query filtering, sorting, pagination
│   ├── AppError.js                 # Custom error class
│   ├── catchAsync.js               # Async error wrapper
│   ├── email.js                    # Nodemailer utility
│   ├── geminiService.js            # Gemini AI client — image analysis + response normalization
│   ├── imageProcessor.js           # Image validation (format, size, dimensions)
│   ├── uploadFoodImage.js          # Multer config for in-memory image upload
│   └── analyzeImageRateLimiter.js  # Per-user rate limiter for the AI endpoint
├── docs/
│   └── analyze-image.swagger.yaml  # OpenAPI spec for the AI image analysis endpoint
├── tests/
│   ├── imageProcessor.test.js      # Unit tests for image validation
│   └── geminiService.test.js       # Unit tests for AI response parsing/normalization
├── data/
│   ├── food.json                   # Seed data for food
│   ├── users.json                  # Seed data for users
│   ├── reviews.json                # Seed data for reviews
│   └── import-dev-data.js          # Import/delete seed data script
└── package.json
```

## Features

- Food catalog CRUD, filtering, sorting, pagination, and stats aggregation
- Geospatial search (`$geoWithin`, `$geoNear`) and full-text search
- JWT authentication, role-based access control, password reset via email
- Reviews & ratings with auto-calculated averages
- **AI food image analysis** — upload a photo and get back structured food metadata (name, description, ingredients, allergens, dietary tags, cuisine, category, calories, spice level, confidence score) via Google Gemini
- Security middleware: Helmet, rate limiting, NoSQL injection sanitization, XSS protection, HPP

## AI Food Image Analysis

`POST /api/v1/food/analyze-image` — merchant/admin only, rate limited to 10 requests / 15 min per user.

Send a `multipart/form-data` request with an `image` field (JPEG/PNG/WebP, max 10 MB, min 200x200px). See the full request/response contract, error codes, and examples in [`docs/analyze-image.swagger.yaml`](./docs/analyze-image.swagger.yaml).

Implementation is split into two pure, independently testable layers plus I/O boundaries:

- `utils/imageProcessor.js` — validates the uploaded buffer (format sniffing, size, resolution)
- `utils/geminiService.js` — calls the Gemini SDK (`analyze`) and normalizes/validates the raw AI response into the `Food_Metadata` schema (`parseAndValidate`)
- `utils/uploadFoodImage.js` — Multer middleware (in-memory storage, file filter, size limit)
- `utils/analyzeImageRateLimiter.js` — per-user sliding-window rate limiter

## Testing

Tests are written with Jest and live in `tests/`. They cover the pure logic layers (image validation and AI response normalization) with no external network calls.

```bash
npm test
```

## Linting

```bash
npm install eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```
