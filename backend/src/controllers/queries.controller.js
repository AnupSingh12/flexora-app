import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CustomerQueries } from "../models/customerQuery.model.js";

const uploadCustomerQuery = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const formData = req.body;

    let querries;
    querries = await CustomerQueries.create({
      userId,
      userName: formData.name,
      userEmail: formData.email,
      subject: formData.subject,
      message: formData.message,
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

const getCustomerQueries = asyncHandler(async (req, res) => {
  try {
    const queries = await CustomerQueries.find({});

    return res
      .status(200)
      .json(new ApiResponse(200, queries, "Successfully get all the queries"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong while getting customer queries"
    );
  }
});

const updateCustomerQueryStatus = asyncHandler(async (req, res) => {
  try {
    const { status, query } = req.body;
    if (status === "in-progress") {
      await CustomerQueries.findByIdAndUpdate(
        query._id,
        { status: status },
        { new: true }
      );
    } else if (status === "resolved") {
      await CustomerQueries.findByIdAndDelete(query._id);
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Sucessfully updated the query status of customer"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message ||
        "Something went wrong while updating customer query status"
    );
  }
});
export { uploadCustomerQuery, getCustomerQueries, updateCustomerQueryStatus };
