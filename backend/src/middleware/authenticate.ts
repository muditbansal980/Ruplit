import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthPayload {
  id: string;
  role: "USER" | "TEAM" | "ADMIN";
  type: "user" | "team" | "admin";
}

// Extend Express Request to include auth info
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

/**
 * Authenticate middleware — verifies JWT and attaches auth payload to req.auth.
 * For USER role, also supports a simple mobile-based session (demo-only).
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For USER role: check if user ID is in query params (demo-only mobile auth)
    const userId = req.query.userId as string;
    if (userId) {
      req.auth = { id: userId, role: "USER", type: "user" };
      return next();
    }
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Generate a JWT token for TEAM/ADMIN users.
 */
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload as any, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}
