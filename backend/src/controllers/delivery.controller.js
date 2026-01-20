import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OrderDataForAdmin } from "../models/orderDataAdmin.model.js";
import { OrderDetails } from "../models/orderDetails.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  try {
    const { deliveryStatus, status } = req.body;

    const userId = deliveryStatus.userId;
    const orderId = deliveryStatus.orderId;

    console.log("----orderid---", orderId);

    // Update OrderDetails
    const updatedOrderDetails = await OrderDetails.findOneAndUpdate(
      { userID: userId, "orderDetails._id": orderId },
      { $set: { "orderDetails.$.orderStatus": status } },
      { new: true }
    );

    // Update OrderDataForAdmins
    const updatedAdminOrderData = await OrderDataForAdmin.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: status } },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        // 200,
        // //   { updatedOrderDetails, updatedAdminOrderData },
        "Order status updated successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "something went wrong while updating delivery status"
    );
  }
});

export { updateDeliveryStatus };
