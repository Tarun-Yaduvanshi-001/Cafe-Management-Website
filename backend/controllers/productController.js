import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Rating from "../models/ratingModel.js";
import Order from "../models/orderModel.js";

// @desc Fetch all products with filtering and pagination
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};
  const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
  let query = Product.find({ ...keyword, ...categoryFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (req.query.sortBy) {
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    query = query.sort({ [req.query.sortBy]: sortOrder });
  }
  const products = await query;
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const ratings = await Rating.find({ product: req.params.id }).populate(
      "user",
      "name"
    );
    res.json({ product, ratings });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "items.product": req.params.id,
      "paymentDetails.paymentStatus": "Paid",
    });
    if (!hasPurchased) {
      res.status(400);
      throw new Error("You can only review products you have purchased.");
    }
    const alreadyReviewed = await Rating.findOne({
      product: req.params.id,
      user: req.user._id,
    });
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const newRating = new Rating({
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: req.params.id,
    });
    await newRating.save();
    // Update product's average rating
    const ratings = await Rating.find({ product: req.params.id });
    product.totalRatings = ratings.length;
    product.averageRating =
      ratings.reduce((acc, item) => item.rating + acc, 0) / ratings.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById, createProductReview };
