import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import kycRoutes from "../modules/kyc/kyc.routes.js";
import expensesRoutes from "../modules/expenses/expenses.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import agentRoutes from "../modules/agent/agent.routes.js";

const router = Router();

// Health check
router.use(healthRoutes);

// Auth module
router.use(authRoutes);

// KYC module
router.use(kycRoutes);

// Expenses module
router.use(expensesRoutes);

// Admin module
router.use(adminRoutes);

// Agent module
router.use(agentRoutes);

export default router;
