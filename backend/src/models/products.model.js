import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
    },

    stock: {
      type: Number,
      required: true,
    },

    thumbnail: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],

    sizes: [{ type: String }],
    color: { type: String },

    ratings: { type: Number, default: 0 },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        userName: {
          type: String,
          required: true,
          trim: true,
        },

        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        comment: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },

        images: [
          {
            type: String,
          },
        ],

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    sku: { type: String, unique: true },
    vendor: { type: String },

    shippingDetails: {
      weight: Number,
      height: Number,
      width: Number,
      length: Number,
      deliveryTime: String,
    },

    returnPolicy: String,

    soldCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
