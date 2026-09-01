import { prisma } from "../../db/client.js";

/**
 * Get all users for admin dashboard.
 * Supports pagination, search, and filtering by KYC status.
 */
export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
}) {
  const { page = 1, limit = 20, search, kycStatus } = params;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { mobileNumber: { contains: search } },
    ];
  }

  if (kycStatus) {
    where.kycStatus = kycStatus;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        mobileNumber: true,
        preferredLanguage: true,
        kycStatus: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            lentExpenses: true,
            borrowedExpenses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single user by ID for admin view.
 */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      mobileNumber: true,
      preferredLanguage: true,
      kycStatus: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      lentExpenses: {
        select: {
          id: true,
          amount: true,
          description: true,
          createdAt: true,
          borrower: {
            select: { id: true, name: true, mobileNumber: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      borrowedExpenses: {
        select: {
          id: true,
          amount: true,
          description: true,
          createdAt: true,
          lender: {
            select: { id: true, name: true, mobileNumber: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      kycRequests: {
        select: {
          id: true,
          mode: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  // Calculate total expenses
  const totalLent = user.lentExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const totalBorrowed = user.borrowedExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return {
    ...user,
    stats: {
      totalLent,
      totalBorrowed,
      totalExpenses: user.lentExpenses.length + user.borrowedExpenses.length,
      kycRequests: user.kycRequests.length,
    },
  };
}

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

/**
 * Get all expenses for admin dashboard.
 * Supports pagination, search, and filtering.
 */
export async function getAllExpenses(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 20, search } = params;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { description: { contains: search, mode: "insensitive" } },
      { lender: { email: { contains: search, mode: "insensitive" } } },
      { borrower: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      select: {
        id: true,
        amount: true,
        description: true,
        emailSent: true,
        createdAt: true,
        lender: {
          select: { id: true, email: true, mobileNumber: true },
        },
        borrower: {
          select: { id: true, email: true, mobileNumber: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get all team members for admin view.
 */
export async function getAllTeamMembers() {
  return prisma.teamMember.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Add a new team member.
 */
export async function addTeamMember(data: {
  name: string;
  email: string;
  password: string;
}) {
  // Check if email already exists
  const existing = await prisma.teamMember.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Team member with this email already exists");
  }

  // Hash password
  const bcrypt = await import("bcrypt");
  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.teamMember.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: "TEAM",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}
