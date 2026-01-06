import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getWishlistProducts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );

    return res.json({
      data: wishlist || { items: [] },
    });
  } catch (err) {
    throw new ApiError(500, err.message);
  }
});

const productAddToWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    let wishlist;

    // First check if wishlist exists in DB
    wishlist = await Wishlist.findOne({ userId });

    // No wishlist exists → create one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId }],
      });

      user.wishlist = wishlist._id;
      await user.save();
    } else {
      // wishlist exists → add product
      const alreadyExists = wishlist.items.some(
        (item) => item.productId.toString() === productId
      );

      if (alreadyExists) {
        throw new ApiError(400, "Product already exist");
      }

      wishlist.items.push({ productId });
      await wishlist.save();
    }
    return res.status(200).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    throw new ApiError(401, " unable to add product to wishlist");
  }
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const wishlist = await Wishlist.findById(user.wishlist);

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found");
    }

    const existedProductID = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    if (!existedProductID) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    throw new ApiError(401, "unable to delete product");
  }
});

export { getWishlistProducts, productAddToWishlist, removeFromWishlist };
