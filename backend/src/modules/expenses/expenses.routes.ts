import { Router } from "express";
import { addFriend, getFriends, addExpense } from "./expenses.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

// All expense routes require USER authentication
router.post("/friends", authenticate, authorize(["USER"]), addFriend);
router.get("/friends", authenticate, authorize(["USER"]), getFriends);
router.post("/expenses", authenticate, authorize(["USER"]), addExpense);

export default router;
