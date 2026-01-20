import { Router } from "express";
import { updateDeliveryStatus } from "../controllers/delivery.controller.js";

const deliveryRouter = Router();

deliveryRouter
  .route("/api/update-deliveryStatus-status")
  .post(updateDeliveryStatus);

export { deliveryRouter };
