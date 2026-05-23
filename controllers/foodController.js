const fs = require("fs");

const food_data = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/food.json`, "utf-8"),
);

exports.checkID = (req, res, val, next) => {
  if (req.params.id * 1 > food_data.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
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

exports.getAllFood = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: food_data.length,
    data: {
      food_data,
    },
  });
};

exports.getFood = (req, res) => {
  const id = req.params.id * 1;
  const food = food_data.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      food,
    },
  });
};

exports.createFood = (req, res) => {
  const newId = food_data[food_data.length - 1].id + 1;
  const newFood = Object.assign({ id: newId }, req.body);

  food_data.push(newFood);

  fs.writeFile(
    `${__dirname}/../dev-data/data/food.json`,
    JSON.stringify(food_data),
    (err) => {
      res.status(200).json({
        status: "success",
        data: {
          food: newFood,
        },
      });
    },
  );
};

exports.updateFood = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

exports.deleteFood = (req, res) => {
  res.status(200).json({
    status: "success",
    data: null,
  });
};
