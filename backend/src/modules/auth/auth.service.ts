import { prisma } from "../../db/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import { generateToken, type AuthPayload } from "../../middleware/authenticate.js";
import bcrypt from "bcrypt";

interface SignupResult {
  user: {
    id: string;
    mobileNumber: string;
    email: string | null;
    preferredLanguage: string;
    role: string;
  };
  token: string;
}

/**
 * Find or create a user by mobile number (demo-only mobile auth).
 * Also handles the case where email is already taken by another user.
 */
export async function signup(
  mobileNumber: string,
  email: string
): Promise<SignupResult> {
  if (!mobileNumber || mobileNumber.length < 10) {
    throw new AppError(400, "Valid mobile number is required");
  }
  if (!email || !email.includes("@")) {
    throw new AppError(400, "Valid email is required");
  }

  // Step 1: Find existing user by mobile number
  let user = await prisma.user.findUnique({ where: { mobileNumber } });
  let isNewUser = !user;

  if (user) {
    // Existing user logging in — update email if changed
    if (user.email !== email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (!emailTaken || emailTaken.id === user.id) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { email },
        });
      }
    }
  } else {
    // Step 2: No user with this mobile — check if email is already taken
    const emailUser = await prisma.user.findUnique({ where: { email } });
    if (emailUser) {
      // Link this mobile number to the existing email account
      user = await prisma.user.update({
        where: { id: emailUser.id },
        data: { mobileNumber },
      });
      isNewUser = false; // They already had an account
    } else {
      // Brand new user
      user = await prisma.user.create({
        data: { mobileNumber, email },
      });
    }
  }

  // Log activity
  await prisma.activity.create({
    data: {
      type: isNewUser ? "signup" : "login",
      actorId: user.id,
      actorRole: "USER",
      details: { mobileNumber, email },
    },
  });

  const payload: AuthPayload = {
    id: user.id,
    role: "USER",
    type: "user",
  };

  return {
    user: {
      id: user.id,
      mobileNumber: user.mobileNumber,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      role: "USER",
    },
    token: generateToken(payload),
  };
}

/**
 * Team member login with email + password.
 */
export async function teamLogin(
  email: string,
  password: string
): Promise<{ member: any; token: string }> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const member = await prisma.teamMember.findUnique({
    where: { email },
  });

  if (!member) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, member.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const payload: AuthPayload = {
    id: member.id,
    role: "TEAM",
    type: "team",
  };

  return {
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      role: "TEAM",
    },
    token: generateToken(payload),
  };
}

/**
 * Admin login with email + password.
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<{ admin: any; token: string }> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const payload: AuthPayload = {
    id: admin.id,
    role: "ADMIN",
    type: "admin",
  };

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    },
    token: generateToken(payload),
  };
}

/**
 * Get current user/team/admin by ID.
 */
export async function getMe(auth: AuthPayload): Promise<any> {
  switch (auth.type) {
    case "user": {
      const user = await prisma.user.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          mobileNumber: true,
          email: true,
          preferredLanguage: true,
          kycStatus: true,
          createdAt: true,
        },
      });
      if (!user) throw new AppError(404, "User not found");
      return { ...user, role: "USER" };
    }
    case "team": {
      const member = await prisma.teamMember.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      if (!member) throw new AppError(404, "Team member not found");
      return { ...member, role: "TEAM" };
    }
    case "admin": {
      const admin = await prisma.admin.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      if (!admin) throw new AppError(404, "Admin not found");
      return { ...admin, role: "ADMIN" };
    }
  }
}
