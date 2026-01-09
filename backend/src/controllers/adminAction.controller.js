import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const holdAccount = asyncHandler(async (req, res) => {
  try {
    const { customer } = req.body;

    const user = await User.findById(customer._id);

    user.isActive = "onHold";

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Successfully Updated the Status of Customer"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong while changing the account status to onHold"
    );
  }
});

const unHoldAccount = asyncHandler(async (req, res) => {
  try {
    const { customer } = req.body;

    const user = await User.findById(customer._id);

    user.isActive = "active";

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Successfully Updated the Status of Customer"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong while changing the account status to Unhold"
    );
  }
});

const softDeleteAccount = asyncHandler(async (req, res) => {
  try {
    const { customer } = req.body;

    const user = await User.findById(customer._id);

    user.isActive = "deleted";

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Successfully Updated the Status of Customer"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong while changing the account status to Unhold"
    );
  }
});

const permanentlyDeleteAccountandData = asyncHandler(async (req, res) => {
  try {
    const { customer } = req.body;

    const user = await User.findByIdAndDelete(customer._id);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong while deleting cusotmer data"
    );
  }
});
export {
  holdAccount,
  unHoldAccount,
  softDeleteAccount,
  permanentlyDeleteAccountandData,
};
