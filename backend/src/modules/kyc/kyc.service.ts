import { prisma } from "../../db/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import { uploadImage } from "../../services/storage.service.js";

interface CreateKycRequestParams {
  mode: "ASSISTED" | "SELF";
  mobileNumber?: string;
  userId?: string;
}

/**
 * Create a KYC request (guest or logged-in user).
 */
export async function createKycRequest(params: CreateKycRequestParams) {
  const { mode, mobileNumber, userId } = params;

  if (!mobileNumber) {
    throw new AppError(400, "Mobile number is required");
  }

  // If userId provided, verify it exists
  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, "User not found");
    }
  }

  const request = await prisma.kycRequest.create({
    data: {
      mode,
      mobileNumber,
      userId: userId || null,
      status: mode === "ASSISTED" ? "PENDING" : "IN_REVIEW",
    },
    include: {
      user: {
        select: { id: true, mobileNumber: true, email: true },
      },
    },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      type: "kyc_request_created",
      actorId: userId || null,
      actorRole: "USER",
      details: {
        requestId: request.id,
        mode,
        mobileNumber,
      },
    },
  });

  return request;
}

/**
 * Upload Aadhar photo to a KYC request.
 */
export async function uploadAadhar(
  requestId: string,
  file: Express.Multer.File,
  teamMemberId?: string
) {
  const request = await prisma.kycRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError(404, "KYC request not found");
  }

  // Upload to Cloudinary
  const result = await uploadImage(file.buffer, "banksahayak/kyc");

  const updated = await prisma.kycRequest.update({
    where: { id: requestId },
    data: {
      aadharImageUrl: result.url,
      status: teamMemberId ? "IN_REVIEW" : "IN_REVIEW",
    },
  });

  return updated;
}

/**
 * Get live (unclaimed) KYC requests for team dashboard.
 */
export async function getLiveRequests() {
  return prisma.kycRequest.findMany({
    where: {
      mode: "ASSISTED",
      status: "PENDING",
      assignedTeamMemberId: null,
    },
    include: {
      user: {
        select: { id: true, mobileNumber: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Accept a KYC request (team member claims it).
 */
export async function acceptRequest(requestId: string, teamMemberId: string) {
  const request = await prisma.kycRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError(404, "KYC request not found");
  }

  if (request.assignedTeamMemberId) {
    throw new AppError(409, "Request already claimed by another team member");
  }

  const updated = await prisma.kycRequest.update({
    where: { id: requestId },
    data: {
      assignedTeamMemberId: teamMemberId,
      status: "IN_REVIEW",
    },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      type: "kyc_request_accepted",
      actorId: teamMemberId,
      actorRole: "TEAM",
      details: { requestId, teamMemberId },
    },
  });

  return updated;
}

/**
 * Reject a KYC request.
 */
export async function rejectRequest(
  requestId: string,
  actorId: string,
  actorRole: "TEAM" | "ADMIN"
) {
  const request = await prisma.kycRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError(404, "KYC request not found");
  }

  const updated = await prisma.kycRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      type: "kyc_request_rejected",
      actorId,
      actorRole,
      details: { requestId },
    },
  });

  return updated;
}

/**
 * Get requests accepted by a specific team member.
 */
export async function getMyAccepted(teamMemberId: string) {
  return prisma.kycRequest.findMany({
    where: {
      assignedTeamMemberId: teamMemberId,
      status: { not: "REJECTED" },
    },
    include: {
      user: {
        select: { id: true, mobileNumber: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get self-mode submissions awaiting review.
 */
export async function getReviewQueue() {
  return prisma.kycRequest.findMany({
    where: {
      mode: "SELF",
      status: "IN_REVIEW",
    },
    include: {
      user: {
        select: { id: true, mobileNumber: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Mark a KYC request as VERIFIED.
 */
export async function verifyRequest(
  requestId: string,
  teamMemberId: string
) {
  const request = await prisma.kycRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError(404, "KYC request not found");
  }

  const updated = await prisma.kycRequest.update({
    where: { id: requestId },
    data: { status: "VERIFIED" },
  });

  // Update user's KYC status if they have a userId
  if (request.userId) {
    await prisma.user.update({
      where: { id: request.userId },
      data: { kycStatus: "VERIFIED" },
    });
  }

  // Log activity
  await prisma.activity.create({
    data: {
      type: "kyc_verified",
      actorId: teamMemberId,
      actorRole: "TEAM",
      details: { requestId, userId: request.userId },
    },
  });

  return updated;
}

/**
 * Get KYC status for a specific user.
 */
export async function getUserKycStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      kycStatus: true,
      kycRequests: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          mode: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}
