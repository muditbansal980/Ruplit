import type { Request, Response } from "express";
import { prisma } from "../db/client.js";

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, email } = req.body;
    const user = await prisma.user.create({ data: { mobileNumber, email } });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
};
