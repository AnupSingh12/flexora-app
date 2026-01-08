import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userAuthStatus,
  updateUser,
  createAdmin,
  userInfo,
  loginAdmin,
  couponsUsedByUser,
  getAllCutomersInfo,
  getCutomersOrderDetails,
} from "./../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "./../middlewares/auth.middleware.js";

const router = Router();

//router for register new user
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

//router for login existing user
router.route("/login").post(loginUser);
//router for login admin
router.route("/login/admin").post(loginAdmin);

//router to logout the user
router.route("/logout").post(authMiddleware, logoutUser);

//router for refresh token
router.route("/refreshToken").post(refreshAccessToken);

//router to check user authentication status
router.route("/status-check").get(userAuthStatus);

// Update user data (requires auth)
router.route("/updateUser").put(authMiddleware, updateUser);

router.route("/user-info").get(authMiddleware, userInfo);

// Admin creation route (creates or promotes a user to admin)
router.route("/admin/register").post(createAdmin);

router.route("/api/v1/users/me").get(authMiddleware, userInfo);

router
  .route("/api/update-user-coupon-value")
  .post(authMiddleware, couponsUsedByUser);

router.route("/api/get-customers-info").get(getAllCutomersInfo);

router.route("/api/get-customers-order-details").post(getCutomersOrderDetails);

export default router;
