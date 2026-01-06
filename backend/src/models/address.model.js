import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  addresses: [
    {
      houseNumber: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      addressType: {
        type: String,
        default: "Home",
      },
      contactNumber: {
        type: String,
      },
      userName: {
        type: String,
      },
    },
  ],
});

const Address = mongoose.model("Address", addressSchema);

export { Address };
