import mongoose from "mongoose";

const orderDataSchema = new mongoose.Schema([
  {
    userId: {
      type: String,
    },
    productId: {
      type: String,
    },
    size: {
      type: String,
    },
    quantity: {
      type: String,
    },
    orderId: {
      type: String,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
]);

export const OrderDataForAdmin = mongoose.model(
  "OrderDataForAdmin",
  orderDataSchema
);
