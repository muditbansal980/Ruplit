import type { Request, Response } from "express";
import * as adminService from "./admin.service.js";

/**
 * GET /api/admin/users
 * Get all users with pagination, search, and filtering.
 */
export const getUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = (req.query.search as string) || undefined;
  const kycStatus = (req.query.kycStatus as string) || undefined;

  const result = await adminService.getUsers({
    page,
    limit,
    search,
    kycStatus,
  });
  res.json(result);
};

/**
 * GET /api/admin/users/:id
 * Get a single user by ID with detailed info.
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await adminService.getUserById(id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
};

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

/**
 * GET /api/admin/expenses
 * Get all expenses with pagination and search.
 */
export const getAllExpenses = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = (req.query.search as string) || undefined;

  const result = await adminService.getAllExpenses({
    page,
    limit,
    search,
  });
  res.json(result);
};

/**
 * GET /api/admin/team-members
 * Get all team members.
 */
export const getAllTeamMembers = async (_req: Request, res: Response) => {
  const result = await adminService.getAllTeamMembers();
  res.json(result);
};

/**
 * POST /api/admin/team-members
 * Add a new team member.
 */
export const addTeamMember = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const result = await adminService.addTeamMember({ name, email, password });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
