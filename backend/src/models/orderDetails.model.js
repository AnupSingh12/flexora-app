import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: String,
  quantity: String,
  addedAt: Date,
});

const couponSchema = new mongoose.Schema({
  coupon: {
    code: String,
    discountType: String,
    discountValue: Number,
    minPurchaseAmount: Number,
    maxDiscountAmount: Number,
  },
  discountAmount: Number,
});

const orderEntrySchema = new mongoose.Schema({
  items: [itemSchema],
  couponUsed: couponSchema,
  selectedAddressId: {
    type: String,
  },
  totalAmountPaid: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    default: "COD",
  },
  orderStatus: {
    type: String,
    default: "Order Recieved",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const orderDetailsSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    orderDetails: [orderEntrySchema],
  },
  { timestamps: true }
);

export const OrderDetails = mongoose.model("OrderDetails", orderDetailsSchema);
