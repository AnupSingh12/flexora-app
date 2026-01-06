import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      usageLimit,
      allowedUsers,
      isActive,
    } = req.body;

    if (
      !code ||
      !discountType ||
      discountValue == null ||
      !startDate ||
      !expiryDate
    ) {
      throw new ApiError(400, "Missing required coupon fields");
    }

    // normalize
    const normalized = {
      code: String(code).toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minPurchaseAmount: minPurchaseAmount ? Number(minPurchaseAmount) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? Number(usageLimit) : 1,
      allowedUsers: Array.isArray(allowedUsers) ? allowedUsers : [],
      isActive: isActive == null ? true : Boolean(isActive),
    };

    // Prevent duplicate code
    const exists = await Coupon.findOne({ code: normalized.code });
    if (exists) {
      throw new ApiError(409, "Coupon code already exists");
    }

    const coupon = await Coupon.create(normalized);

    return res
      .status(201)
      .json(new ApiResponse(201, coupon, "Coupon created successfully"));
  } catch (error) {
    if (error.statusCode) throw error;
    throw new ApiError(500, error.message || "Failed to create coupon");
  }
});

const getCoupons = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const user = await User.findById(userId);
    const userUsedCoupons = user.usedCoupons;
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
    }).select(
      "code discountType discountValue minPurchaseAmount maxDiscountAmount usageLimit"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { coupons, userUsedCoupons },
          "Coupons fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch coupons");
  }
});

export { createCoupon, getCoupons };
