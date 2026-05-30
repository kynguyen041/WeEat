const fs = require("fs");
const Food = require("./../model/foodModel");

//bug
exports.aliasTopFood = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,description,cuisine";
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "fail",
      message: "missing name or price",
    });
  }
  next();
};

exports.getAllFood = async (req, res) => {
  try {
    //BUILD QUERY
    //1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    //1B Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Food.find(JSON.parse(queryStr));

    //2 Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //3 Limiting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    //4 Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numFood = await Food.countDocuments();
      if (skip >= numFood) {
        throw new Error("This page does not exist");
      }
    }

    const food_data = await query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: food_data.length,
      data: {
        food_data,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        food,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createFood = async (req, res) => {
  const newFood = await Food.create(req.body);
  try {
    res.status(200).json({
      status: "success",
      data: {
        newFood,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        food,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: message,
    });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: message,
    });
  }
};
