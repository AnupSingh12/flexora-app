import mongoose from "mongoose";

const customerQuerrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    default: "view",
  },
});

const CustomerQueries = mongoose.model(
  "CustomerQuerries",
  customerQuerrySchema
);

export { CustomerQueries };
