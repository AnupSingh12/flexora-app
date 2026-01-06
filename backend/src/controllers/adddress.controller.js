import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Address } from "../models/address.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/products.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllAddresses = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const addresses = await Address.findOne({ userId });
    return res
      .status(200)
      .json({ addresses: addresses ? addresses.addresses : [] });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const getPriceDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const cart = await Cart.findOne({ userId });
    const cartProducts = cart.items;
    const productPrices = await Promise.all(
      cartProducts.map(async (product) => {
        const prod = await Product.findById(product.productId);
        return { price: prod.price };
      })
    );
    const totalMRP = productPrices.reduce((acc, curr) => acc + curr.price, 0);
    const numberOfItems = cartProducts.length;

    // 1. Fetch all products only once
    const products = await Promise.all(
      cartProducts.map((item) => Product.findById(item.productId))
    );
    const totalPrice = products.reduce((acc, pd) => {
      const discountedPrice =
        pd.price - (pd.price * pd.discountPercentage) / 100;
      return acc + discountedPrice;
    }, 0);

    const totalDiscount = products.reduce((acc, pd) => {
      const discount = (pd.price * pd.discountPercentage) / 100;
      return acc + discount;
    }, 0);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalMRP, numberOfItems, totalPrice, totalDiscount },
          "Price details fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const editAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const index = req.params.index;
    const updatedAddress = req.body;

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      throw new ApiError(404, "Address not found");
    }

    if (index < 0 || index >= addressDoc.addresses.length) {
      throw new ApiError(400, "Invalid address index");
    }

    addressDoc.addresses[index] = updatedAddress;
    await addressDoc.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Address updated successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const removeAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const index = req.params.index;

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      throw new ApiError(404, "Address not found");
    }

    if (index < 0 || index >= addressDoc.addresses.length) {
      throw new ApiError(400, "Invalid address index");
    }

    addressDoc.addresses = addressDoc.addresses.filter((_, i) => i != index);
    await addressDoc.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Address updated successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

const addAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }
    const newAddress = req.body;

    let addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      addressDoc = new Address({ userId, addresses: [] });
    }

    addressDoc.addresses.push(newAddress);
    await addressDoc.save();

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Address added successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something went wrong"
    );
  }
});

export {
  getAllAddresses,
  getPriceDetails,
  editAddress,
  removeAddress,
  addAddress,
};
