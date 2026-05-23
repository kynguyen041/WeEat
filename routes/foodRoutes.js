const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

router.param("id", foodController.checkID);

router
  .route("/")
  .get(foodController.getAllFood)
  .post(foodController.checkBody, foodController.createFood);

router
  .route("/:id")
  .get(foodController.getFood)
  .patch(foodController.updateFood)
  .delete(foodController.deleteFood);

module.exports = router;
