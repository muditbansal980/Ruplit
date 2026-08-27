import type { Request, Response } from "express";
import * as adminService from "./admin.service.js";

/**
 * GET /api/admin/activities
 * Get activity feed.
 */
export const getActivities = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 50;
  const result = await adminService.getActivities(limit);
  res.json(result);
};

/**
 * GET /api/admin/team-stats
 * Get team member stats.
 */
export const getTeamStats = async (_req: Request, res: Response) => {
  const result = await adminService.getTeamStats();
  res.json(result);
};

/**
 * GET /api/admin/kyc-requests
 * Get all KYC requests.
 */
export const getAllKycRequests = async (_req: Request, res: Response) => {
  const result = await adminService.getAllKycRequests();
  res.json(result);
};
