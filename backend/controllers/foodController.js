const fs = require("fs");
const Food = require("./../model/foodModel");
const User = require("../model/userModel");
const APIFeature = require("./../utils/apiFeature");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const factory = require("../controllers/handlerFactory");

exports.aliasTopFood = (req, res, next) => {
  req.aliasQuery = {
    limit: "5",
    sort: "-ratingsAverage,price",
    fields: "name,price,ratingsAverage,description,cuisine",
  };
  next();
};

// exports.getAllFood = catchAsync(async (req, res, next) => {
//   const queryParams = req.aliasQuery || req.query;
//   const features = new APIFeature(Food.find(), queryParams)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const food_data = await features.query;

//   res.status(200).json({
//     status: "success",
//     requestedAt: req.requestTime,
//     results: food_data.length,
//     data: {
//       food_data,
//     },
//   });
// });

exports.getAllFood = factory.getAll(Food);
exports.getFood = factory.getOne(Food, { path: "reviews" });
exports.createFood = factory.createOne(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);

exports.getFoodStats = catchAsync(async (req, res, next) => {
  const stats = await Food.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$cuisine" },
        numFood: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.searchFood = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword?.trim();

  if (!keyword) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: {
        data: [],
      },
    });
  }

  const merchants = await User.find({
    role: "merchant",
    name: {
      $regex: keyword,
      $options: "i",
    },
  }).select("_id");

  const merchantIds = merchants.map((merchant) => merchant._id);

  // const start = performance.now();
  // const food_data = await Food.find({
  //   $or: [
  //     {
  //       name: {
  //         $regex: keyword,
  //         $options: "i",
  //       },
  //     },
  //     {
  //       category: {
  //         $regex: keyword,
  //         $options: "i",
  //       },
  //     },
  //     {
  //       cuisine: {
  //         $regex: keyword,
  //         $options: "i",
  //       },
  //     },
  //     {
  //       merchant: {
  //         $in: merchantIds,
  //       },
  //     },
  //   ],
  // }).populate("merchant");
  const food_data = await Food.find({
    $or: [
      {
        $text: {
          $search: keyword,
        },
      },
      {
        merchant: {
          $in: merchantIds,
        },
      },
    ],
  });
  // const end = performance.now();

  // console.log(`Search query took ${end - start} ms`);
  res.status(200).json({
    status: "success",
    results: food_data.length,
    data: {
      data: food_data,
    },
  });
});

exports.getAllergenStats = catchAsync(async (req, res, next) => {
  const stats = await Food.aggregate([
    {
      $unwind: "$allergens",
    },
    {
      $group: {
        _id: "$allergens",
        numFood: { $sum: 1 },
        food: { $push: "$name" },
      },
    },
    {
      $addFields: { allergens: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// /food-within/:distance/center/:latlng/unit/:unit
// /food-within/233/center/34.111745,-118.113491/unit/mi
exports.getFoodWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      ),
    );
  }

  const food = await Food.find({
    restaurantLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: food.length,
    data: {
      data: food,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      ),
    );
  }

  const distances = await Food.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
