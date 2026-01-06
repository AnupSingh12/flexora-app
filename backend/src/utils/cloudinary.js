import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No local file path");
      return null;
    }

    const normalized = localFilePath.replace(/\\/g, "/");
    const absolute = path.resolve(normalized);

    const result = await cloudinary.uploader.upload(absolute, {
      resource_type: "auto",
    });

    fs.unlinkSync(absolute);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    try {
      fs.unlinkSync(localFilePath);
    } catch (e) {}
    return null;
  }
};
