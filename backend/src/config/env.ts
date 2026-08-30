/**
 * Validates required environment variables on boot.
 * Fails fast with a clear message if any are missing.
 */

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "BREVO_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

export function validateEnv(): void {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `\n❌ Missing required environment variables:\n  ${missing.join("\n  ")}\n\nAdd them to backend/.env and restart.\n`
    );
    process.exit(1);
  }
}

export const env = {
  get PORT() {
    return Number(process.env.PORT) || 5000;
  },
  get DATABASE_URL() {
    return process.env.DATABASE_URL!;
  },
  get JWT_SECRET() {
    return process.env.JWT_SECRET!;
  },
  get JWT_EXPIRES_IN() {
    return process.env.JWT_EXPIRES_IN || "7d";
  },
  get FRONTEND_URL() {
    return process.env.FRONTEND_URL || "http://localhost:3000";
  },
  get BREVO_API_KEY() {
    return process.env.BREVO_API_KEY!;
  },
  get EMAIL_FROM() {
    return process.env.EMAIL_FROM || "muditban2008@gmail.com";
  },
  get CLOUDINARY_CLOUD_NAME() {
    return process.env.CLOUDINARY_CLOUD_NAME!;
  },
  get CLOUDINARY_API_KEY() {
    return process.env.CLOUDINARY_API_KEY!;
  },
  get CLOUDINARY_API_SECRET() {
    return process.env.CLOUDINARY_API_SECRET!;
  },
  get MAX_UPLOAD_SIZE_MB() {
    return Number(process.env.MAX_UPLOAD_SIZE_MB) || 5;
  },
};
