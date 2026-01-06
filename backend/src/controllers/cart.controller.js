import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCartProducts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    return res.json({
      data: cart || { items: [] },
    });
  } catch (err) {
    throw new ApiError(500, err.message);
  }
});

const addProductToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    let cart;

    // First check if cart exists in DB
    cart = await Cart.findOne({ userId });

    // No cart exists then create one
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId }],
      });

      user.cart = cart._id;
      await user.save();
    } else {
      // Cart exists then add product
      const alreadyExists = cart.items.some(
        (item) => item.productId.toString() === productId
      );
      if (alreadyExists) {
        throw new ApiError(400, "Product already exist");
      }

      cart.items.push({ productId });
      await cart.save();
    }
    return res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || " Something went wrong"
    );
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something Went wrong"
    );
  }
});

export { getCartProducts, addProductToCart, removeProductFromCart };

const updateSize = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, size } = req.body;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.find((it) => it.productId.toString() === productId);

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }
    item.size = "";
    item.size = size;
    await cart.save();

    res.status(200).json({ message: "Size updated", cart });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const updateQuantity = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.find((it) => it.productId.toString() === productId);

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }
    item.quantity = "";
    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const updateCouponValue = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { coupon } = req.body;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);
    cart.couponUsed.coupon = null;
    cart.couponUsed.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
    };

    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Coupon addded Successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something Went wrong while updating coupon value "
    );
  }
});

const updateDiscountValue = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { couponValue } = req.body;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);

    cart.couponUsed.discountedAmount = 0;
    cart.couponUsed.discountedAmount = couponValue;
    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Discount value Added successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something Went wrong while updating coupon value "
    );
  }
});

const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  const cart = await Cart.findById(user.cart);

  cart.couponUsed.coupon = null;
  cart.couponUsed.discountedAmount = 0;

  await cart.save();

  return res.status(200).json(new ApiResponse(200, "Coupon removed"));
});

const getUsedCouponData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);

    const couponData = cart.couponUsed;

    return res
      .status(200)
      .json(
        new ApiResponse(200, couponData, "Coupon data fetched successfully")
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something Went wrong while fetching coupon data "
    );
  }
});

export { updateSize, updateQuantity };
export {
  updateCouponValue,
  updateDiscountValue,
  removeCoupon,
  getUsedCouponData,
};
