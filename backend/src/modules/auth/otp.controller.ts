import type { Request, Response } from "express";
import * as otpService from "./otp.service.js";

/**
 * POST /auth/send-otp
 * Sends a 6-digit OTP to the user's email.
 */
export const sendOtp = async (req: Request, res: Response) => {
  const { email, purpose } = req.body;
  const result = await otpService.sendOtp(email, purpose || "signup");
  res.json(result);
};

/**
 * POST /auth/verify-otp
 * Verifies the OTP code. Returns 200 on success.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, code, purpose } = req.body;
  const valid = await otpService.verifyOtp(email, code, purpose || "signup");
  res.json({ verified: valid });
};
