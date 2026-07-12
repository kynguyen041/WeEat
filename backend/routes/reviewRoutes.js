const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo("customer"),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route("/:id")
  .patch(
    authController.restrictTo("customer", "admin"),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo("customer", "admin"),
    reviewController.deleteReview,
  );
module.exports = router;
