import type { Request, Response } from "express";
import { prisma } from "../db/client.js";

export const healthCheck = async (_req: Request, res: Response) => {
  let dbStatus = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error(
      "Database connection failed:",
      err instanceof Error ? err.message : String(err)
    );
    dbStatus = "disconnected";
  }
  res.json({
    message: "Backend is running",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};
