import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/products.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "./../models/user.model.js";
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));

    return products;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch products");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const payload = req.body;
    // basic validation
    if (!payload.title || !payload.price) {
      throw new ApiError(400, "Title and price are required");
    }

    // Use provided thumbnail, or fallback to first image, or empty string
    let thumbnail =
      payload.thumbnail ||
      (Array.isArray(payload.images) && payload.images[0]) ||
      "";

    const product = await Product.create({
      title: payload.title,
      gender: payload.gender || "Unisex",
      description: payload.description || "",
      brand: payload.brand || "",
      category: payload.category || payload.categoryName || "",
      price: Number(payload.price) || 0,
      discountPercentage: payload.discountPercentage || 0,
      stock: Number(payload.stock) || 0,
      thumbnail: thumbnail,
      images: Array.isArray(payload.images) ? payload.images : [],
      sizes: Array.isArray(payload.sizes) ? payload.sizes : [],
      productType: payload.productType,
      color: payload.color,
      sku: payload.sku || undefined,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    if (error.statusCode) throw error;
    throw new ApiError(500, error.message || "Failed to create product");
  }
});

const getReviews = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }
    const productId = req.body.productId;

    const product = await Product.findById(productId);

    const reviews = product.reviews;

    return res
      .status(200)
      .json(new ApiResponse(200, reviews, "Get reviews successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const addReviews = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { productId, reviewDetails } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    // Prevent multiple reviews by same user
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      throw new ApiError(400, "You have already reviewed this product");
    }

    // Correct rating calculation
    const oldReviewCount = product.reviews.length;
    const oldAverageRating = product.ratings || 0;

    const newAverageRating =
      (oldAverageRating * oldReviewCount + reviewDetails.rating) /
      (oldReviewCount + 1);

    const review = {
      userId,
      userName: user.userName,
      rating: reviewDetails.rating,
      comment: reviewDetails.comment,
      images: reviewDetails.images || [],
    };

    product.ratings = Number(newAverageRating.toFixed(1)); // optional rounding
    product.reviews.push(review);

    await product.save();

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Review Added successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "message something went wrong"
    );
  }
});

export { getAllProducts, createProduct, getReviews, addReviews };
