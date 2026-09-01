import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a buffer (image) to Cloudinary.
 * Returns the secure URL and public ID.
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string = "banksahayak/kyc"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      },
      (error, result) => {
        if (error) {
          console.error("[Storage] Cloudinary upload error:", error);
          reject(new Error("Failed to upload image"));
          return;
        }
        if (!result) {
          reject(new Error("No result from Cloudinary"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[Storage] Cloudinary delete error:", err);
  }
}
