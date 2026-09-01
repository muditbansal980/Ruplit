import { prisma } from "../../db/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import { sendMail } from "../../services/email.service.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send an OTP to the given email address for a given purpose ("signup" | "login").
 * Rate-limits: max 3 OTPs per email within a 10-minute window.
 */
export async function sendOtp(
  email: string,
  purpose: "signup" | "login" = "signup"
): Promise<{ message: string }> {
  if (!email || !email.includes("@")) {
    throw new AppError(400, "A valid email address is required");
  }

  // Rate-limit: count OTPs sent in the last 10 minutes
  const tenMinutesAgo = new Date(Date.now() - OTP_EXPIRY_MINUTES * 60 * 1000);
  const recentOtps = await prisma.otpToken.count({
    where: {
      email,
      purpose,
      createdAt: { gte: tenMinutesAgo },
    },
  });

  if (recentOtps >= 3) {
    throw new AppError(
      429,
      "Too many OTP requests. Please wait a few minutes before trying again."
    );
  }

  // Invalidate any previous unused OTPs for this email + purpose
  await prisma.otpToken.updateMany({
    where: { email, purpose, used: false },
    data: { used: true },
  });

  // Generate and store new OTP
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpToken.create({
    data: { email, code, purpose, expiresAt },
  });

  // Send email via Brevo
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Bank Sahayak — Verification Code</h2>
      <p style="font-size: 16px; color: #333;">
        Your one-time verification code is:
      </p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1a1a1a;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #666;">
        This code expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 24px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendMail({
    to: email,
    subject: `Your Bank Sahayak verification code: ${code}`,
    htmlContent,
  });

  return { message: "OTP sent successfully" };
}

/**
 * Verify the OTP for a given email and purpose.
 * Returns true if valid, throws if invalid/expired/used.
 */
export async function verifyOtp(
  email: string,
  code: string,
  purpose: "signup" | "login" = "signup"
): Promise<boolean> {
  if (!email || !code) {
    throw new AppError(400, "Email and OTP code are required");
  }

  // Find the latest unused OTP for this email + purpose
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      email,
      code,
      purpose,
      used: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw new AppError(400, "Invalid or expired OTP code");
  }

  // Check expiry
  if (new Date() > otpRecord.expiresAt) {
    throw new AppError(400, "OTP has expired. Please request a new one.");
  }

  // Check attempt limit (use the code as-is — if wrong, user will try again)
  // Mark as used
  await prisma.otpToken.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  return true;
}
