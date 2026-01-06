import { Cart } from "../models/cart.model.js";
import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { OrderDetails } from "../models/orderDetails.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(400, "User not authenticated");

    const { cartData, couponData, selectedAddressId, totalAmount } = req.body;

    if (!cartData?.items || cartData.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    if (!selectedAddressId || selectedAddressId.length === 0) {
      throw new ApiError(400, "No address selected for the order");
    }
    // Format coupon data properly according to schema
    const formattedCoupon = couponData
      ? {
          coupon: {
            code: couponData?.data?.coupon?.code || "",
            discountType: couponData?.data?.coupon?.discountType || "",
            discountValue: couponData?.data?.coupon?.discountValue || 0,
            minPurchaseAmount: couponData?.data?.coupon?.minPurchaseAmount || 0,
            maxDiscountAmount: couponData?.data?.coupon?.maxDiscountAmount || 0,
          },
          discountAmount: couponData?.data?.discountedAmount || 0,
        }
      : undefined;

    // Normalize items coming from frontend and filter out broken entries
    const normalizedItems = (cartData.items || []).map((it) => {
      const productId =
        it.productId?._id || it.productId || it.product?._id || null;
      return {
        productId,
        size: it.size,
        quantity: it.quantity || 1,
        addedAt: it.addedAt || Date.now(),
      };
    });

    const missingItems = normalizedItems.filter((i) => !i.productId);
    if (missingItems.length > 0) {
      console.warn(
        "placeOrder: items missing productId for user",
        userId.toString(),
        missingItems
      );
    }

    const itemsToPush = normalizedItems.filter((i) => i.productId);

    // Create or update order details
    const order = await OrderDetails.findOneAndUpdate(
      { userID: userId },
      {
        $push: {
          orderDetails: {
            items: itemsToPush,
            couponUsed: formattedCoupon || {},
            selectedAddressId: selectedAddressId[0],
            totalAmountPaid: totalAmount || null,
          },
        },
      },
      { new: true, upsert: true }
    );
    //decrease the stocks value  and the remove size that user just purchased from products collection
    for (const item of itemsToPush) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      // Reduce total stock
      product.stock -= item.quantity || 1;

      product.soldCount += item.quantity || 1;

      // Remove ONLY `quantity` occurrences of the selected size
      let qtyToRemove = item.quantity || 1;

      product.sizes = product.sizes.filter((size) => {
        if (size === item.size && qtyToRemove > 0) {
          qtyToRemove--;
          return false;
        }
        return true;
      });

      await product.save();
    }

    // Empty cart after successful order
    if (order) {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = [];
        cart.couponUsed = {
          coupon: null,
          discountedAmount: 0,
        };
        await cart.save();
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Order details created successfully", order));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went Wrong"
    );
  }
});

export { placeOrder };
