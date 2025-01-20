const Product = require("../models/product");
const Review = require("../models/review");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("reviews");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });
    await review.save();

    // Calculate the average rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    // Update the product with the new average rating
    const product = await Product.findById(productId);
    product.rating = avgRating;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
