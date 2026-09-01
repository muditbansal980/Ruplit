import type { Request, Response } from "express";
import * as expensesService from "./expenses.service.js";

/**
 * POST /api/friends
 * Add a friend by phone number.
 */
export const addFriend = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const result = await expensesService.addFriend(req.auth!.id, phoneNumber);
  res.status(201).json(result);
};

/**
 * GET /api/friends
 * List current user's friends.
 */
export const getFriends = async (req: Request, res: Response) => {
  const result = await expensesService.getFriends(req.auth!.id);
  res.json(result);
};

/**
 * POST /api/expenses
 * Add an expense (money lent to a friend).
 */
export const addExpense = async (req: Request, res: Response) => {
  const { friendId, amount, description } = req.body;
  const result = await expensesService.addExpense(
    req.auth!.id,
    friendId,
    amount,
    description
  );
  res.status(201).json(result);
};
