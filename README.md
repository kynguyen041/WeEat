# WeEat 🍔

A full-stack food delivery mobile application that connects customers with nearby restaurants. Users can browse food by location, search by keyword, view detailed food info (ingredients, allergens, dietary tags), leave reviews, and place orders.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo SDK 57, TypeScript, expo-router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose v6) |
| Auth | JWT + bcrypt |
| Location | expo-location, MongoDB GeoJSON ($geoWithin, $geoNear) |
| AI | Google Gemini (`@google/generative-ai`) for food image recognition |
| File Upload | Multer (in-memory), Sharp (image validation) |
| Testing | Jest |

## Features

- **Location-based food discovery** — Find food within a radius using geospatial queries
- **Full-text search** — Search by food name, description, cuisine, category, or merchant
- **Authentication** — Signup, login, JWT-protected routes, password reset via email
- **Role-based access control** — Customer, driver, merchant, admin
- **Reviews & Ratings** — Customers review food; average ratings auto-calculated
- **Food catalog** — Filtering, sorting, pagination, stats aggregation
- **Categories** — Burger, Pizza, Noodles, Salad, Dessert, Drink, Chicken, Rice Bowl, Soup
- **Cuisines** — Japanese, Korean, Thai, Vietnamese, Chinese, Italian, American, Indian, Mexican
- **AI food image analysis** — Merchants/admins upload a food photo and get back AI-extracted metadata (name, description, ingredients, allergens, dietary tags, cuisine, category, calories, spice level, confidence) via Google Gemini
- **Security** — Helmet, rate limiting, NoSQL injection sanitization, XSS protection, HPP

## Project Structure

```
WeEat/
├── backend/
│   ├── server.js                  # Entry point — connects MongoDB, starts Express server
│   ├── app.js                     # Express app config, middleware stack, route mounting
│   ├── .env                       # Environment variables (not committed)
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, protect, password reset
│   │   ├── foodController.js      # Food CRUD, search, geospatial, stats, AI image analysis
│   │   ├── userController.js      # User profile, updateMe, deleteMe
│   │   ├── reviewController.js    # Review CRUD
│   │   ├── handlerFactory.js      # Generic CRUD factory functions
│   │   └── errorController.js     # Global error handler (incl. Multer error normalization)
│   ├── model/
│   │   ├── foodModel.js           # Food schema (GeoJSON, text index, virtuals)
│   │   ├── userModel.js           # User schema (roles, addresses, password hashing)
│   │   └── reviewModel.js         # Review schema (auto rating calculation)
│   ├── routes/
│   │   ├── foodRoutes.js          # /api/v1/food endpoints (incl. /analyze-image)
│   │   ├── userRoutes.js          # /api/v1/user endpoints
│   │   └── reviewRoutes.js        # /api/v1/reviews endpoints
│   ├── utils/
│   │   ├── apiFeature.js               # Query filtering, sorting, pagination
│   │   ├── AppError.js                 # Custom error class
│   │   ├── catchAsync.js               # Async error wrapper
│   │   ├── email.js                    # Nodemailer utility
│   │   ├── geminiService.js            # Gemini AI client — image analysis + response normalization
│   │   ├── imageProcessor.js           # Image validation (format, size, dimensions)
│   │   ├── uploadFoodImage.js          # Multer config for in-memory image upload
│   │   └── analyzeImageRateLimiter.js  # Per-user rate limiter for the AI endpoint
│   ├── docs/
│   │   └── analyze-image.swagger.yaml  # OpenAPI spec for the AI image analysis endpoint
│   ├── tests/
│   │   ├── imageProcessor.test.js      # Unit tests for image validation
│   │   └── geminiService.test.js       # Unit tests for AI response parsing/normalization
│   ├── data/
│   │   ├── food.json              # Seed data for food
│   │   ├── users.json             # Seed data for users
│   │   ├── reviews.json           # Seed data for reviews
│   │   └── import-dev-data.js     # Import/delete seed data script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Expo Router file-based routing
│   │   │   ├── _layout.tsx        # Root Stack navigator
│   │   │   ├── analyze-image.tsx  # AI food image analysis route
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx    # Tab navigator (Home, Cart, Activity, Messages)
│   │   │   │   ├── index.tsx      # Home tab
│   │   │   │   ├── cart.tsx       # Cart tab
│   │   │   │   ├── activity.tsx   # Activity tab
│   │   │   │   └── message.tsx    # Messages tab
│   │   │   ├── food/
│   │   │   │   └── [id].tsx       # Dynamic food detail route
│   │   │   └── search.tsx         # Search page
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx               # Nearby food, categories, location header
│   │   │   ├── FoodDetailScreen.tsx          # Food image, description, add to cart
│   │   │   ├── AnalyzeFoodImageScreen.tsx    # AI image capture + analysis results
│   │   │   ├── CartScreen.tsx               # Cart
│   │   │   ├── ActivityScreen.tsx           # Order activity
│   │   │   ├── MessageScreen.tsx            # Messages
│   │   │   ├── ProfileScreen.tsx            # User profile
│   │   │   └── SettingsScreen.tsx           # App settings
│   │   ├── api/
│   │   │   ├── config.ts          # API base URL
│   │   │   ├── foodAPI.ts         # Food API calls + analyzeFoodImage upload
│   │   │   └── types.ts           # TypeScript interfaces (Food, User, Review, FoodMetadata, AnalyzeImageResult)
│   │   ├── styles/
│   │   │   ├── HomeScreen.styles.ts
│   │   │   ├── FoodDetailScreen.styles.ts
│   │   │   ├── SearchScreen.styles.ts
│   │   │   └── AnalyzeFoodImageScreen.styles.ts
│   │   └── utils/
│   │       └── imagePicker.ts     # Camera/library permission requests + picker helpers
│   ├── assets/                    # Images, icons, splash screen
│   ├── app.json                   # Expo config (permissions, plugins)
│   └── package.json
│
└── README.md
```

## API Endpoints

### Food
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/food` | List all food (filter, sort, paginate) | Public |
| POST | `/api/v1/food` | Create food | Merchant/Admin |
| GET | `/api/v1/food/:id` | Get single food with reviews | Public |
| PATCH | `/api/v1/food/:id` | Update food | Merchant/Admin |
| DELETE | `/api/v1/food/:id` | Delete food | Merchant/Admin |
| GET | `/api/v1/food/search?keyword=` | Full-text search | Public |
| GET | `/api/v1/food/food_within/:distance/center/:lat,:lng/unit/:unit` | Geospatial search | Public |
| GET | `/api/v1/food/distances/:lat,:lng/unit/:unit` | Get distances | Public |
| GET | `/api/v1/food/top-5-food` | Top 5 rated food | Public |
| GET | `/api/v1/food/food-stats` | Cuisine stats | Public |
| GET | `/api/v1/food/allergen-stats` | Allergen stats | Public |
| POST | `/api/v1/food/analyze-image` | AI food image analysis (auto-extract metadata) | Merchant/Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/user/signup` | Register | Public |
| POST | `/api/v1/user/login` | Login | Public |
| POST | `/api/v1/user/forgotPassword` | Send reset token | Public |
| PATCH | `/api/v1/user/resetPassword/:token` | Reset password | Public |
| GET | `/api/v1/user/me` | Get current user | Protected |
| PATCH | `/api/v1/user/updateMe` | Update profile | Protected |
| DELETE | `/api/v1/user/deleteMe` | Soft delete account | Protected |
| PATCH | `/api/v1/user/updateMyPassword` | Change password | Protected |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/food/:foodId/reviews` | Get reviews for a food | Protected |
| POST | `/api/v1/food/:foodId/reviews` | Create review | Customer |
| PATCH | `/api/v1/reviews/:id` | Update review | Customer/Admin |
| DELETE | `/api/v1/reviews/:id` | Delete review | Customer/Admin |

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=8000
DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/weeat
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
GEMINI_API_KEY=your_google_gemini_api_key
```

> `GEMINI_API_KEY` is required for the AI food image analysis endpoint (`/api/v1/food/analyze-image`). Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

Seed the database (optional):

```bash
node data/import-dev-data.js --import
```

Start the server:

```bash
npm run start:dev
```

Run the backend test suite:

```bash
npm test
```

The AI image analysis endpoint's full request/response contract is documented in [`backend/docs/analyze-image.swagger.yaml`](./backend/docs/analyze-image.swagger.yaml).

### Frontend Setup

```bash
cd frontend
npm install
```

> The project runs on **Expo SDK 57 / React Native 0.86**. If you previously had an older `node_modules`, delete it and run `npm install` fresh to avoid Metro bundler errors.

Update the API base URL in `src/api/config.ts` to match your backend:

```typescript
export const BASE_URL = "http://<YOUR_LOCAL_IP>:8000/api/v1";
```

Start the Expo dev server:

```bash
npm start
```

## Author

Ky Nguyen
