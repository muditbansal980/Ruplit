import { Router } from "express";
import { signup, teamLogin, adminLogin, getMe } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// Public routes
router.post("/auth/signup", signup);
router.post("/team/login", teamLogin);
router.post("/admin/login", adminLogin);

// Authenticated routes
router.get("/auth/me", authenticate, getMe);

export default router;
