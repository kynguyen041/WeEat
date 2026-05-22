const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

router.route("/").get(foodController.getAllFood);

router.route("/:id").get(foodController.getFood);

module.exports = router;
