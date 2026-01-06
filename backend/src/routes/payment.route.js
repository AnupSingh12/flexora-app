import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { placeOrder } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.route("/api/place-order").post(authMiddleware, placeOrder);

export default paymentRouter;
