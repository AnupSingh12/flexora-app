import { OrderDetails } from "./../models/orderDetails.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/products.model.js";

const getOrderDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }
    const OrderData = await OrderDetails.findOne({ userID: userId }).populate(
      "orderDetails.items.productId"
    );

    if (!OrderData) {
      throw new ApiResponse(
        401,
        OrderData || null,
        "User Haven't buy anything yet"
      );
    } else {
      const productData = OrderData.orderDetails.map((entry) => {
        const items = entry.items.map((item) => {
          const product = item.productId;

          return {
            quantity: item.quantity,
            size: item.size,
            image: product?.thumbnail || null,
            title: product?.title || null,
            brand: product?.brand || null,
            price: product?.price || null,
            productId: product?._id || item.productId,
            product,
          };
        });

        const productsPreview = items.map((it) => ({
          productId: it.productId,
          image: it.image,
          title: it.title,
        }));

        return {
          orderId: OrderData._id,
          couponUsed: entry.couponUsed,
          createdAt: entry.addedAt || OrderData.createdAt,
          items,
          products: productsPreview,
          totalAmount: entry.totalAmountPaid || null,
        };
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            productData,
            "Successfully get the Order Details"
          )
        );
    }
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong in getting Order details Controller"
    );
  }
});

export { getOrderDetails };
