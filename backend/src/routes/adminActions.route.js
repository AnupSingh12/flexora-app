import { Router } from "express";
import {
  holdAccount,
  unHoldAccount,
  softDeleteAccount,
  permanentlyDeleteAccountandData,
  getOrderDetails,
} from "../controllers/adminAction.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter
  .route("/api/make-user-account-onHold")
  .post(adminMiddleware, holdAccount);

adminRouter
  .route("/api/make-user-account-UnHold")
  .post(adminMiddleware, unHoldAccount);

adminRouter
  .route("/api/make-user-account-softDelete")
  .post(adminMiddleware, softDeleteAccount);

adminRouter
  .route("/api/delete-user-account-data")
  .post(adminMiddleware, permanentlyDeleteAccountandData);

adminRouter
  .route("/api/order-details-admin")
  .get(adminMiddleware, getOrderDetails);

export { adminRouter };
