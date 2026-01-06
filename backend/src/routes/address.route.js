import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  getAllAddresses,
  getPriceDetails,
  editAddress,
  removeAddress,
  addAddress,
} from "../controllers/adddress.controller.js";

const addressRouter = Router();

addressRouter.route("/get-addresses").post(authMiddleware, getAllAddresses);
addressRouter.route("/get-price").post(authMiddleware, getPriceDetails);
addressRouter.route("/edit-address/:index").post(authMiddleware, editAddress);
addressRouter
  .route("/remove-address/:index")
  .post(authMiddleware, removeAddress);
addressRouter.route("/add-address").post(authMiddleware, addAddress);
export default addressRouter;
