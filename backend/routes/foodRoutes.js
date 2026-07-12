const express = require("express");
const foodController = require("../controllers/foodController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const reviewRouter = require("../routes/reviewRoutes");
const router = express.Router();

router.route("/search").get(foodController.searchFood);
router.use("/:foodId/reviews", reviewRouter);

router
  .route("/top-5-food")
  .get(foodController.aliasTopFood, foodController.getAllFood);

router.route("/food-stats").get(foodController.getFoodStats);
router.route("/allergen-stats").get(foodController.getAllergenStats);

router
  .route("/food_within/:distance/center/:latlng/unit/:unit")
  .get(foodController.getFoodWithin);
// /food-within?distance=233&center=-40,45&unit=mi
// /food-within/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(foodController.getDistances);

router
  .route("/")
  .get(foodController.getAllFood)
  .post(
    authController.protect,
    authController.restrictTo("admin", "merchant"),
    foodController.createFood,
  );

router
  .route("/:id")
  .get(foodController.getFood)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "merchant"),
    foodController.updateFood,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "merchant"),
    foodController.deleteFood,
  );

module.exports = router;
