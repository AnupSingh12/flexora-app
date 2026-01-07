import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  authMiddleware,
  adminMiddleware,
} from "./src/middlewares/auth.middleware.js";
import { couponRouter } from "./src/routes/coupon.route.js";
import addressRouter from "./src/routes/address.route.js";
import paymentRouter from "./src/routes/payment.route.js";
import orderRouter from "./src/routes/order.route.js";
import { queriesRouter } from "./src/routes/queries.route.js";

mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const app = express();
const port = process.env.PORT;

// configurations
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes declaration
app.use("/users", userRouter);
app.use(productRouter);
app.use(couponRouter);
app.use(addressRouter);
app.use(paymentRouter);
app.use(orderRouter);
app.use(queriesRouter);

app.get("/api/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
