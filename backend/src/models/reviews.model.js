import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: String,
  },
  comments: {
    type: Array,
  },
  productId: {
    type: String,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export { Review };
