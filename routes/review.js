const express = require("express");
const { createReview } = require("../controllers/reviewController");
const router = express.Router();

// Route to create a review
router.post("/", createReview);

// Route to get all reviews for a product

module.exports = router;
