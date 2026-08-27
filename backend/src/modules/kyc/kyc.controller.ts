import type { Request, Response } from "express";
import * as kycService from "./kyc.service.js";

/**
 * POST /api/kyc/request
 * Create a KYC request (guest or logged-in).
 */
export const createRequest = async (req: Request, res: Response) => {
  const { mode, mobileNumber } = req.body;
  const userId = req.auth?.id;
  const result = await kycService.createKycRequest({
    mode,
    mobileNumber,
    userId,
  });
  res.status(201).json(result);
};

/**
 * POST /api/kyc/:id/upload
 * Upload Aadhar photo to a KYC request.
 */
export const uploadAadhar = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const result = await kycService.uploadAadhar(id, file, req.auth?.id);
  res.json(result);
};

/**
 * GET /api/kyc/live
 * Get live (unclaimed) KYC requests.
 */
export const getLiveRequests = async (_req: Request, res: Response) => {
  const result = await kycService.getLiveRequests();
  res.json(result);
};

/**
 * POST /api/kyc/:id/accept
 * Accept a KYC request.
 */
export const acceptRequest = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await kycService.acceptRequest(id, req.auth!.id);
  res.json(result);
};

/**
 * POST /api/kyc/:id/reject
 * Reject a KYC request.
 */
export const rejectRequest = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await kycService.rejectRequest(
    id,
    req.auth!.id,
    req.auth!.role as "TEAM" | "ADMIN"
  );
  res.json(result);
};

/**
 * GET /api/kyc/mine
 * Get requests accepted by the current team member.
 */
export const getMyAccepted = async (req: Request, res: Response) => {
  const result = await kycService.getMyAccepted(req.auth!.id);
  res.json(result);
};

/**
 * GET /api/kyc/review-queue
 * Get self-mode submissions awaiting review.
 */
export const getReviewQueue = async (_req: Request, res: Response) => {
  const result = await kycService.getReviewQueue();
  res.json(result);
};

/**
 * POST /api/kyc/:id/verify
 * Mark a KYC request as VERIFIED.
 */
export const verifyRequest = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await kycService.verifyRequest(id, req.auth!.id);
  res.json(result);
};

/**
 * GET /api/kyc/status/:userId
 * Get KYC status for a specific user.
 */
export const getUserKycStatus = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await kycService.getUserKycStatus(userId);
  res.json(result);
};
