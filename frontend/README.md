# WeEat Frontend

React Native / Expo mobile app for the WeEat food delivery platform.

## Setup

```bash
npm install
```

Update the API base URL in `src/api/config.ts` to point at your running backend:

```typescript
export const BASE_URL = "http://<YOUR_LOCAL_IP>:8000/api/v1";
```

Start the Expo dev server:

```bash
npm start
```

Then open in an Android emulator, iOS simulator, or Expo Go on your device.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start on Android emulator |
| `npm run ios` | Start on iOS simulator |
| `npm run web` | Start in the browser |
| `npm run lint` | Run Expo's ESLint check |

## Tech Stack

| | |
|--|--|
| Framework | React Native 0.86, Expo SDK 57 |
| Routing | expo-router (file-based) |
| Language | TypeScript |
| Location | expo-location |
| Image Picker | expo-image-picker (camera + photo library) |
| Icons | @expo/vector-icons (Ionicons) |

## Project Structure

```
frontend/
├── app.json                          # Expo config — permissions, plugins, icons
├── package.json
└── src/
    ├── app/                          # expo-router file-based routes
    │   ├── _layout.tsx               # Root Stack navigator
    │   ├── analyze-image.tsx         # /analyze-image route → AnalyzeFoodImageScreen
    │   ├── explore.tsx               # /explore route
    │   ├── search.tsx                # /search route
    │   └── (tabs)/
    │       ├── _layout.tsx           # Bottom tab navigator
    │       ├── index.tsx             # Home tab
    │       ├── cart.tsx              # Cart tab
    │       ├── activity.tsx          # Activity tab
    │       └── message.tsx           # Messages tab
    │   └── food/
    │       └── [id].tsx              # Dynamic food detail route
    ├── screens/
    │   ├── HomeScreen.tsx            # Nearby food list, categories, location header
    │   ├── FoodDetailScreen.tsx      # Food detail, ingredients, add to cart
    │   ├── AnalyzeFoodImageScreen.tsx # AI food image capture + analysis results
    │   ├── CartScreen.tsx            # Cart
    │   ├── ActivityScreen.tsx        # Order activity
    │   ├── MessageScreen.tsx         # Messages
    │   ├── ProfileScreen.tsx         # User profile
    │   └── SettingsScreen.tsx        # App settings
    ├── api/
    │   ├── config.ts                 # API base URL
    │   ├── foodAPI.ts                # Food endpoints + analyzeFoodImage upload call
    │   └── types.ts                  # TypeScript interfaces (Food, User, Review, FoodMetadata, AnalyzeImageResult)
    ├── styles/
    │   ├── HomeScreen.styles.ts
    │   ├── FoodDetailScreen.styles.ts
    │   ├── SearchScreen.styles.ts
    │   └── AnalyzeFoodImageScreen.styles.ts
    └── utils/
        └── imagePicker.ts            # Camera/library permission requests + picker helpers
```

## Features

- Location-based nearby food discovery using `expo-location`
- Full-text food search by name, cuisine, category, or merchant
- Food detail view with ingredients, allergens, ratings, and dietary tags
- **AI food image analysis** — capture or select a photo, send it to the backend, and display the AI-extracted food metadata (name, description, ingredients, allergens, cuisine, category, calories, spice level, confidence score)

## AI Food Image Analysis

The screen is at `/analyze-image` (`src/app/analyze-image.tsx`).

It lets a merchant or admin take a photo with the camera or pick one from the photo library, upload it to `POST /api/v1/food/analyze-image`, and shows the structured metadata returned by Google Gemini.

Permission handling lives in `src/utils/imagePicker.ts`:
- Requests camera permission before launching the camera
- Requests media library permission before opening the picker
- Shows a Settings deep-link prompt if the user has permanently denied either permission
- Validates minimum image dimensions (200×200px) before uploading

### Required `.env` on the backend

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Pending

The `AnalyzeFoodImageScreen` currently uses a hardcoded empty token (`const token = ""`). A login/auth screen with a JWT store is needed before the endpoint will work end-to-end.

## Permissions

Declared in `app.json`:

| Permission | Platform | Purpose |
|-----------|----------|---------|
| `NSCameraUsageDescription` | iOS | Take a food photo |
| `NSPhotoLibraryUsageDescription` | iOS | Pick a food photo |
| `android.permission.CAMERA` | Android | Take a food photo |
| `android.permission.READ_MEDIA_IMAGES` | Android | Pick a food photo |

## Dependency Upgrade

The project was upgraded from Expo SDK 54 / React Native 0.85 to **Expo SDK 57 / React Native 0.86** to resolve a Metro bundler error (`VirtualViewNativeComponent onModeChange`). Run `npm install` after pulling to get the correct versions.
