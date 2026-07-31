// ====================
// User
// ====================

export interface Coordinates {
  type: "Point";
  coordinates: number[];
}

export interface Address {
  label: "home" | "work" | "other";
  addressLine: string;
  city: string;
  district: string;
  ward: string;
  coordinates: Coordinates;
  isDefault: boolean;
}

export interface User {
  _id: string;

  name: string;
  email: string;
  phone: string;

  role: "customer" | "driver" | "merchant" | "admin";

  avatar: string;

  addresses: Address[];

  currentLocation: Coordinates;

  rating: number;

  totalReviews: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

// ====================
// Review
// ====================

export interface Review {
  _id: string;

  review: string;

  rating: number;

  createdAt: string;

  food: string;

  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

// ====================
// Food
// ====================

export interface RestaurantLocation {
  type: "Point";

  coordinates: number[];

  address: string;

  description: string;
}

export interface Food {
  _id: string;

  name: string;

  slug: string;

  description: string;

  cuisine:
    | "japanese"
    | "korean"
    | "thai"
    | "vietnamese"
    | "chinese"
    | "italian"
    | "american"
    | "indian"
    | "mexican";

  category:
    | "burger"
    | "pizza"
    | "rice bowl"
    | "noodles"
    | "dessert"
    | "drink"
    | "salad"
    | "soup";

  imageCover: string;

  images: string[];

  price: number;

  discountPrice?: number;

  ingredients: string[];

  allergens: string[];

  dietaryTags: (
    | "vegan"
    | "vegetarian"
    | "halal"
    | "gluten_free"
    | "dairy_free"
    | "nut_free"
  )[];

  spiceLevel: number;

  calories?: number;

  preparationTime: number;

  available: boolean;

  ratingsAverage: number;

  ratingsQuantity: number;

  numReviews: number;

  totalOrders: number;

  featured: boolean;

  restaurantLocation: RestaurantLocation;

  merchant: User;

  reviews?: Review[];

  createdAt: string;

  updatedAt: string;
}

