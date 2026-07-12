// review / rating / createdAt / ref to tour / ref to user
const mongoose = require("mongoose");
const Food = require("../model/foodModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    food: {
      type: mongoose.Schema.ObjectId,
      ref: "Food",
      required: [true, "Review must belong to a food."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name avatar",
  });
});

reviewSchema.statics.calcAverageRatings = async function (foodId) {
  const stats = await this.aggregate([
    {
      $match: { food: foodId },
    },
    {
      $group: {
        _id: "$food",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Food.findByIdAndUpdate(foodId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Food.findByIdAndUpdate(foodId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.index({ food: 1, user: 1 }, { unique: true });

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.food);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.food);
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
