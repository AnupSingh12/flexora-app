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
  querryRegarding: {
    type: String,
  },
  querry: {
    type: String,
  },
});

const CustomerQuerries = mongoose.model(
  "CustomerQuerries",
  customerQuerrySchema
);

export { CustomerQuerries };
