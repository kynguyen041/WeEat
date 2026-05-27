const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A food item must have a name"],
    unique: true,
    trim: true,
  },

  description: {
    type: String,
    required: [true, "A food item must have a description"],
  },

  cuisine: {
    type: String,
    required: [true, "A food item must have a cuisine"],
  },

  category: {
    type: String,
    required: [true, "A food item must have a category"],
  },

  price: {
    type: Number,
    required: [true, "A food item must have a price"],
  },

  discountPrice: {
    type: Number,
  },

  ingredients: {
    type: [String],
    required: [true, "A food item must have ingredients"],
  },

  allergens: {
    type: [String],
  },

  calories: {
    type: Number,
  },

  spicyLevel: {
    type: Number,
    min: 0,
    max: 5,
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  available: {
    type: Boolean,
    default: true,
  },

  deliveryTime: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
