const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Food must have a name"],
    trim: true,
    unique: true,
    maxlength: [100, "Food name cannot exceed 100 characters"],
  },

  slug: String,

  description: {
    type: String,
    required: [true, "Food must have a description"],
    trim: true,
  },

  cuisine: {
    type: String,
    required: [true, "Food must have a cuisine"],
    lowercase: true,
    enum: [
      "japanese",
      "korean",
      "thai",
      "vietnamese",
      "chinese",
      "italian",
      "american",
      "indian",
      "mexican",
    ],
  },

  category: {
    type: String,
    required: [true, "Food must have a category"],
    enum: [
      "burger",
      "pizza",
      "rice bowl",
      "noodles",
      "dessert",
      "drink",
      "salad",
      "soup",
    ],
  },

  imageCover: {
    type: String,
    required: [true, "Food must have a cover image"],
  },

  images: [String],

  price: {
    type: Number,
    required: [true, "Food must have a price"],
    min: [1, "Price must be above 0"],
  },

  discountPrice: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price must be below regular price",
    },
  },

  ingredients: {
    type: [String],
    required: [true, "Food must include ingredients"],
  },

  allergens: [String],

  dietaryTags: [
    {
      type: String,
      enum: [
        "vegan",
        "vegetarian",
        "halal",
        "gluten_free",
        "dairy_free",
        "nut_free",
      ],
    },
  ],

  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  calories: {
    type: Number,
    min: 0,
  },

  preparationTime: {
    type: Number,
    required: [true, "Food must have preparation time"],
  },

  available: {
    type: Boolean,
    default: true,
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
    set: (val) => Math.round(val * 10) / 10,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  totalOrders: {
    type: Number,
    default: 0,
  },

  featured: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
