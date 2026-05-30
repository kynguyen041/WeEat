const express = require("express");
const foodController = require("../controllers/foodController");

const router = express.Router();

//bug: aliasTopFood
router
  .route("/top-5-food")
  .get(foodController.aliasTopFood, foodController.getAllFood);

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
