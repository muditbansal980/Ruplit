import { prisma } from "../../db/client.js";
import { AppError } from "../../middleware/errorHandler.js";
import { sendExpenseNotification } from "../../services/email.service.js";

/**
 * Add a friend by phone number (requires registered user).
 */
export async function addFriend(ownerId: string, phoneNumber: string) {
  // Find the friend by mobile number
  const friend = await prisma.user.findUnique({
    where: { mobileNumber: phoneNumber },
  });

  if (!friend) {
    throw new AppError(404, "No user found with this phone number");
  }

  if (friend.id === ownerId) {
    throw new AppError(400, "You cannot add yourself as a friend");
  }

  // Check if friendship already exists
  const existing = await prisma.friendship.findUnique({
    where: {
      ownerId_friendId: { ownerId, friendId: friend.id },
    },
  });

  if (existing) {
    throw new AppError(409, "Already friends with this user");
  }

  const friendship = await prisma.friendship.create({
    data: {
      ownerId,
      friendId: friend.id,
    },
    include: {
      friend: {
        select: { id: true, mobileNumber: true, email: true, preferredLanguage: true },
      },
    },
  });

  return friendship;
}

/**
 * List current user's friends.
 */
export async function getFriends(ownerId: string) {
  return prisma.friendship.findMany({
    where: { ownerId },
    include: {
      friend: {
        select: { id: true, mobileNumber: true, email: true, preferredLanguage: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Add an expense (money lent to a friend).
 */
export async function addExpense(
  lenderId: string,
  friendId: string,
  amount: number,
  description: string
) {
  if (!amount || amount <= 0) {
    throw new AppError(400, "Amount must be greater than 0");
  }
  if (!description || description.trim().length === 0) {
    throw new AppError(400, "Description is required");
  }

  // Verify the friend relationship exists
  const friendship = await prisma.friendship.findUnique({
    where: {
      ownerId_friendId: { ownerId: lenderId, friendId },
    },
    include: {
      friend: { select: { id: true, email: true } },
    },
  });

  if (!friendship) {
    throw new AppError(404, "Friend not found");
  }

  // Get lender info for email notification
  const lender = await prisma.user.findUnique({
    where: { id: lenderId },
    select: { id: true, mobileNumber: true, email: true },
  });

  const expense = await prisma.expense.create({
    data: {
      lenderId,
      borrowerId: friendId,
      amount,
      description,
    },
  });

  // Send email notification to the borrower (friend)
  let emailSent = false;
  if (friendship.friend.email) {
    try {
      await sendExpenseNotification({
        to: friendship.friend.email,
        fromName: lender?.mobileNumber || "Someone",
        amount,
        description,
      });
      emailSent = true;
    } catch {
      // Email failure shouldn't block the expense creation
    }
  }

  // Update emailSent flag
  if (emailSent) {
    await prisma.expense.update({
      where: { id: expense.id },
      data: { emailSent: true },
    });
  }

  // Log activity
  await prisma.activity.create({
    data: {
      type: "expense_created",
      actorId: lenderId,
      actorRole: "USER",
      details: {
        expenseId: expense.id,
        friendId,
        amount,
        description,
        emailSent,
      },
    },
  });

  return { ...expense, emailSent };
}
