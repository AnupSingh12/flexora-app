import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import jwt from "jsonwebtoken";

const userAuthStatus = asyncHandler(async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(200).json({
        isLoggedIn: false,
        message: "No access token found",
      });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(200).json({
        isLoggedIn: false,
        message: "User not found for the provided acess token",
      });
    }

    return res.status(200).json({
      isLoggedIn: true,
      user: user,
      message: "User is Logged In Successfully",
    });
  } catch (error) {
    return res.status(200).json({
      isLoggedIn: false,
      message: "Access token is invalid or expired",
      error: error.message,
    });
  }
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userEmail, password } = req.body;

  if ([userEmail, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are requireds");
  }
  // check if user already exist or not
  const existedUser = await User.findOne({
    $or: [{ userEmail }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email is already exist");
  }

  //check image for avatar
  const avatarlocalPath = req.files?.avatar[0]?.path;
  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarlocalPath);
  const user = await User.create({
    email: userEmail.toLowerCase(),
    password,
    // avatar: avatar.url,
  });

  //create user
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // things we don't want to show we pt it here
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went Wrong while registering the response "
    );
  }
  //generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  // return response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          createdUser,
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
});

const createAdmin = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;

  if (![email, password].every((f) => f && String(f).trim() !== "")) {
    throw new ApiError(400, "Email and password are required");
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    // If exists, promote to admin
    existing.role = "admin";
    if (userName) existing.userName = userName;
    if (password) existing.password = password;
    await existing.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existing._id
    );
    const options = { httpOnly: true, secure: true };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, existing, "Admin promoted successfully"));
  }

  const user = await User.create({
    email: String(email).toLowerCase(),
    password,
    userName: userName || "Admin",
    role: "admin",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = { httpOnly: true, secure: true };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { createdUser, accessToken, refreshToken },
        "Admin created successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role !== "user") {
      throw new ApiError(404, "the role should be user to login ");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged in SuccessFully"
        )
      );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role !== "admin") {
      throw new ApiError(404, "the role should be user to login ");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged in SuccessFully"
        )
      );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }

    if (incomingToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
});
const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { userName, gender, contactNumber, address } = req.body;

    let addressId;
    if (address) {
      const createdAddress = await Address.create({
        userId: userId,
        addresses: [address],
      });
      addressId = createdAddress._id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        gender,
        contactNumber,
        ...(addressId ? { address: addressId } : {}),
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update user");
  }
});

const userInfo = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const userInfo = await User.findById(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, userInfo, "User updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update user");
  }
});

const couponsUsedByUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const AllcouponData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 🔹 If no coupon data is sent, just return success
    if (
      !AllcouponData?.couponData?.data?.coupon ||
      Object.keys(AllcouponData.couponData.data.coupon).length === 0
    ) {
      return res.status(200).json({
        success: true,
        message: "Order placed without coupon",
        usedCoupons: user.usedCoupons,
      });
    }

    const couponData = AllcouponData.couponData.data.coupon;

    const coupon = await Coupon.findOne({
      code: couponData.code,
      discountType: couponData.discountType,
      discountValue: couponData.discountValue,
      minPurchaseAmount: couponData.minPurchaseAmount,
      maxDiscountAmount: couponData.maxDiscountAmount,
    });

    // 🔒 If coupon not found, prevent crash
    if (!coupon) {
      throw new ApiError(400, "Invalid or expired coupon");
    }

    const existingCoupon = user.usedCoupons.find(
      (c) => c.couponId.toString() === coupon._id.toString()
    );

    if (existingCoupon) {
      existingCoupon.numberOfTimeUsed += 1;
    } else {
      user.usedCoupons.push({
        couponId: coupon._id,
        numberOfTimeUsed: 1,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Coupon usage updated",
      usedCoupons: user.usedCoupons,
    });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong while updating coupon value in user data"
    );
  }
});

export {
  registerUser,
  createAdmin,
  loginUser,
  loginAdmin,
  userAuthStatus,
  logoutUser,
  refreshAccessToken,
  updateUser,
  userInfo,
  couponsUsedByUser,
};
