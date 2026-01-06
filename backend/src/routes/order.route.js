import { Router } from "express";
import { authMiddleware } from "./../middlewares/auth.middleware.js";
import { getOrderDetails } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/api/order-details").get(authMiddleware, getOrderDetails);

export default orderRouter;
