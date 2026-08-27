import type { Request, Response } from "express";
import * as authService from "./auth.service.js";

/**
 * POST /api/auth/signup
 * Find or create user by mobile number.
 */
export const signup = async (req: Request, res: Response) => {
  const { mobileNumber, email } = req.body;
  const result = await authService.signup(mobileNumber, email);
  res.status(201).json(result);
};

/**
 * POST /api/team/login
 * Team member login with email + password.
 */
export const teamLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.teamLogin(email, password);
  res.json(result);
};

/**
 * POST /api/admin/login
 * Admin login with email + password.
 */
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.adminLogin(email, password);
  res.json(result);
};

/**
 * GET /api/auth/me
 * Returns current identity + role.
 */
export const getMe = async (req: Request, res: Response) => {
  const result = await authService.getMe(req.auth!);
  res.json(result);
};
