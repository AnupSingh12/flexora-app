import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { createCoupon, getCoupons } from "../controllers/coupon.controller.js";
import {
  removeCoupon,
  updateCouponValue,
  updateDiscountValue,
  getUsedCouponData,
} from "../controllers/cart.controller.js";
const couponRouter = Router();

couponRouter
  .route("/admin/coupons")
  .post(authMiddleware, adminMiddleware, createCoupon);

couponRouter.route("/coupons").get(authMiddleware, getCoupons);
couponRouter
  .route("/api/update-coupon-values")
  .post(authMiddleware, updateCouponValue);

couponRouter
  .route("/api/update-discount-values")
  .post(authMiddleware, updateDiscountValue);

couponRouter.route("/api/remove-coupon").post(authMiddleware, removeCoupon);

couponRouter
  .route("/api/get-coupon-data")
  .get(authMiddleware, getUsedCouponData);

export { couponRouter };
