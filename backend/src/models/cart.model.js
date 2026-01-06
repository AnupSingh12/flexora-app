import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
        },
        quantity: {
          type: String,
        },

        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    couponUsed: {
      coupon: {
        type: Object,
        default: null,
      },
      discountedAmount: {
        type: String,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
export { Cart };
