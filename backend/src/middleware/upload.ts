import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";

/**
 * Multer upload config — stores files in memory for Cloudinary upload.
 * Validates: image only (jpg/png), max size from env.
 */
const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only JPG/PNG images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
});
