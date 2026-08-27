import { Router } from "express";
import {
  createRequest,
  uploadAadhar,
  getLiveRequests,
  acceptRequest,
  rejectRequest,
  getMyAccepted,
  getReviewQueue,
  verifyRequest,
  getUserKycStatus,
} from "./kyc.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { upload } from "../../middleware/upload.js";

const router = Router();

// Public/authenticated — create KYC request
router.post("/kyc/request", createRequest);

// Upload Aadhar photo (self or team)
router.post(
  "/kyc/:id/upload",
  upload.single("aadhar"),
  uploadAadhar
);

// Team-only routes
router.get("/kyc/live", authenticate, authorize(["TEAM"]), getLiveRequests);
router.post("/kyc/:id/accept", authenticate, authorize(["TEAM"]), acceptRequest);
router.post("/kyc/:id/reject", authenticate, authorize(["TEAM", "ADMIN"]), rejectRequest);
router.get("/kyc/mine", authenticate, authorize(["TEAM"]), getMyAccepted);
router.get("/kyc/review-queue", authenticate, authorize(["TEAM"]), getReviewQueue);
router.post("/kyc/:id/verify", authenticate, authorize(["TEAM"]), verifyRequest);

// User — own KYC status
router.get("/kyc/status/:userId", getUserKycStatus);

export default router;
