const express = require("express");
const {
  getProducts,
  createProduct,
  // createReview,
  getProductById,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const {
  getReviewsByProduct,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.route("/").get(getProducts).post(protect, createProduct);
router.route("/:id").get(getProductById);
router
  .route("/:productId/reviews")
  .get(protect, getReviewsByProduct)
  .post(protect, createReview);

module.exports = router;
