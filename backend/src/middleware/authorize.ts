import type { Request, Response, NextFunction } from "express";

type Role = "USER" | "TEAM" | "ADMIN";

/**
 * RBAC guard — use after authenticate middleware.
 * Usage: router.get("/kyc/live", authenticate, authorize(["TEAM"]), handler)
 */
export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: req.auth.role,
      });
      return;
    }

    next();
  };
}
