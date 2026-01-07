import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CustomerQuerries } from "../models/customerQuerry.model.js";

const uploadCustomerQuerry = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const formData = req.body;

    let querries;
    querries = await CustomerQuerries.create({
      userId,
      userName: formData.name,
      userEmail: formData.email,
      querryRegarding: formData.subject,
      querry: formData.message,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, formData, "SucessFully sent querry to the Admin")
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong while uploading customer querry"
    );
  }
});

export { uploadCustomerQuerry };
