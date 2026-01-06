import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import * as dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

dotenv.config();

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access token");
  }
});

// ROLE BASED
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
};
