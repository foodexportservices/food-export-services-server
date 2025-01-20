const Review = require("../models/review");
const Product = require("../models/product"); // Adjust the path if needed

// Create a new review
// const createReview = async (req, res) => {
//   try {
//     const { product, user, image, rating, comment } = req.body;

//     // Validate required fields
//     if (!product || !user || !rating || !comment) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided." });
//     }

//     // Create and save the new review
//     const newReview = await Review.create({
//       product,
//       user,
//       image,
//       rating,
//       comment,
//       date: new Date().toISOString(),
//     });

//     // Recalculate the product's average rating
//     const reviews = await Review.find({ product });
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     const averageRating = (totalRating / reviews.length).toFixed(1);

//     // Update the product's rating field
//     await Product.findByIdAndUpdate(product, { rating: averageRating });

//     res
//       .status(201)
//       .json({ message: "Review created successfully", review: newReview });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to create review", details: error.message });
//   }
// };
const createReview = async (req, res) => {
  try {
    const { product, user, image, rating, comment } = req.body;

    // Validate required fields
    if (!product || !user || !rating || !comment) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Create and save the new review
    const newReview = await Review.create({
      product,
      user,
      image,
      rating,
      comment,
      date: new Date().toISOString(),
    });

    // Add the review ID to the product's reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      product,
      { $push: { reviews: newReview._id } },
      { new: true }
    );

    // Recalculate the product's average rating
    const reviews = await Review.find({ product });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    // Update the product's rating field
    updatedProduct.rating = averageRating;
    await updatedProduct.save();

    res.status(201).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create review", details: error.message });
  }
};

// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    // Find reviews for the specified product
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name email image"
    ); // Adjust populated fields as needed

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", details: error.message });
  }
};

module.exports = { createReview, getReviewsByProduct };
