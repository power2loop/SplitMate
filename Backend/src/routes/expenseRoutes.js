// Backend/src/routes/expenseRoutes.js
import { Router } from "express";
import { createGroupExpense, listGroupExpenses, createPersonalExpense, deleteGroupExpense } from "../controllers/expenseController.js";
import { validateExpenseCreate } from "../middlewares/ExpenseMiddleware.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = Router();

router.get("/group/:groupId", protect, listGroupExpenses);
router.post("/group/:groupId", protect, validateExpenseCreate, createGroupExpense);
router.delete("/group/:groupId/:expenseId", protect, deleteGroupExpense);

router.post("/personal", protect, validateExpenseCreate, createPersonalExpense);

export default router;
