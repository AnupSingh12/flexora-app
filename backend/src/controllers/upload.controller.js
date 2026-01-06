import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploaded = [];
    for (const file of files) {
      const result = await uploadOnCloudinary(file.path);
      if (result && result.url) {
        uploaded.push({ url: result.secure_url || result.url, raw: result });
      }
      // remove temp file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {}
    }

    return res.status(201).json({
      message: "Files uploaded",
      data: { images: uploaded.map((u) => u.url) },
    });
  } catch (error) {
    throw error;
  }
});

export { uploadImages };
