import type { Request, Response } from "express";
import * as agentService from "./agent.service.js";

/**
 * POST /api/agent/chat
 *
 * Receives the user's query + registry snapshots, returns the LLM's
 * text reply and any tool calls the frontend should execute.
 */
export const chat = async (req: Request, res: Response) => {
  console.log("[agent] Request received:", { query: req.body.query, currentRoute: req.body.currentRoute });
  const { query, currentRoute, pageRegistry, fieldRegistry, history } = req.body;

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "query is required and must be a string" });
    return;
  }

  if (!currentRoute || typeof currentRoute !== "string") {
    res.status(400).json({ error: "currentRoute is required" });
    return;
  }

  const result = await agentService.chat({
    query,
    currentRoute,
    pageRegistry: pageRegistry ?? {},
    fieldRegistry: fieldRegistry ?? {},
    history,
  });

  console.log("[agent] Response:", { reply: result.reply.substring(0, 100), toolCount: result.tools.length });
  res.json(result);
};
