const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("./../model/foodModel");
const Review = require("./../model/reviewModel");
const User = require("./../model/userModel");

// dotenv.config({ path: "./config.env" });

dotenv.config({ path: `${__dirname}/../config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

//READ JSON FILE
const food_data = JSON.parse(
  fs.readFileSync(`${__dirname}/food.json`, "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

//IMPORT DATA FROM DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Food.create(food_data);
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Food.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == "--import") {
  importData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}
