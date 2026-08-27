import { prisma } from "../../db/client.js";

/**
 * Get activity feed for admin dashboard.
 */
export async function getActivities(limit: number = 50) {
  return prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get team member stats (requests accepted/completed per team member).
 */
export async function getTeamStats() {
  const teamMembers = await prisma.teamMember.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const stats = await Promise.all(
    teamMembers.map(async (member) => {
      const accepted = await prisma.kycRequest.count({
        where: {
          assignedTeamMemberId: member.id,
          status: { not: "REJECTED" },
        },
      });

      const completed = await prisma.kycRequest.count({
        where: {
          assignedTeamMemberId: member.id,
          status: "VERIFIED",
        },
      });

      const rejected = await prisma.kycRequest.count({
        where: {
          assignedTeamMemberId: member.id,
          status: "REJECTED",
        },
      });

      return {
        ...member,
        accepted,
        completed,
        rejected,
      };
    })
  );

  return stats;
}

/**
 * Get all KYC requests for admin view.
 */
export async function getAllKycRequests() {
  return prisma.kycRequest.findMany({
    include: {
      user: {
        select: { id: true, mobileNumber: true, email: true },
      },
      assignedTeamMember: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
