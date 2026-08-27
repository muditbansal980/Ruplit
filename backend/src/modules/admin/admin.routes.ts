import { Router } from "express";
import {
  getActivities,
  getTeamStats,
  getAllKycRequests,
} from "./admin.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

// All admin routes require ADMIN authentication
router.get("/admin/activities", authenticate, authorize(["ADMIN"]), getActivities);
router.get("/admin/team-stats", authenticate, authorize(["ADMIN"]), getTeamStats);
router.get("/admin/kyc-requests", authenticate, authorize(["ADMIN"]), getAllKycRequests);

export default router;
