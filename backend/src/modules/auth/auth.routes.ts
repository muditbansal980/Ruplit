import { Router } from "express";
import { signup, teamLogin, adminLogin, getMe } from "./auth.controller.js";
import { sendOtp, verifyOtp } from "./otp.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// Public routes — OTP
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

// Public routes — Auth
router.post("/auth/signup", signup);
router.post("/team/login", teamLogin);
router.post("/admin/login", adminLogin);

// Authenticated routes
router.get("/auth/me", authenticate, getMe);

export default router;
