import { Router } from "express";
import {
  getUsers,
  getUserById,
  getActivities,
  getTeamStats,
  getAllKycRequests,
  getAllExpenses,
  getAllTeamMembers,
  addTeamMember,
} from "./admin.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

// All admin routes require ADMIN authentication
router.get("/admin/users", authenticate, authorize(["ADMIN"]), getUsers);
router.get("/admin/users/:id", authenticate, authorize(["ADMIN"]), getUserById);
router.get("/admin/activities", authenticate, authorize(["ADMIN"]), getActivities);
router.get("/admin/team-stats", authenticate, authorize(["ADMIN"]), getTeamStats);
router.get("/admin/kyc-requests", authenticate, authorize(["ADMIN"]), getAllKycRequests);
router.get("/admin/expenses", authenticate, authorize(["ADMIN"]), getAllExpenses);
router.get("/admin/team-members", authenticate, authorize(["ADMIN"]), getAllTeamMembers);
router.post("/admin/team-members", authenticate, authorize(["ADMIN"]), addTeamMember);

export default router;
