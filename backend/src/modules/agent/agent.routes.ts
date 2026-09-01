import { Router } from "express";
import { chat } from "./agent.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// Agent chat endpoint — auth disabled for testing
router.post("/agent/chat", chat);

export default router;
