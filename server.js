const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
});

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

const testFood = new Food({
  name: "Sushi Ramen Combo",
  description:
    "Japanese ramen served with fresh salmon sushi and soft-boiled egg.",
  cuisine: "japanese",
  category: "noodles",
  price: 18,
  discountPrice: 15,
  ingredients: ["ramen noodles", "salmon", "egg", "seaweed", "soy sauce"],
  allergens: ["fish", "soy", "egg"],
  calories: 850,
  spicyLevel: 2,
  ratingsAverage: 4.8,
  ratingsQuantity: 124,
  available: true,
  deliveryTime: 25,
  createdAt: new Date(),
});

testFood
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
