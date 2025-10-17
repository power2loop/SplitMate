import { Router } from "express";
import {
    createGroupExpense,
    listGroupExpenses,
    deleteGroupExpense,
    createPersonalExpense,
    listPersonalExpenses,
    deletePersonalExpense
} from "../controllers/expenseController.js";//
import { validateExpenseCreate } from "../middlewares/ExpenseMiddleware.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = Router();

// -------- GROUP EXPENSE ROUTES --------
router.post("/group/:groupId", protect, validateExpenseCreate, createGroupExpense);
router.get("/group/:groupId", protect, listGroupExpenses);
router.delete("/group/:groupId/:expenseId", protect, deleteGroupExpense);

// -------- PERSONAL EXPENSE ROUTES --------
router.post("/personal/add", protect, createPersonalExpense);
router.get("/personal/all", protect, listPersonalExpenses);
router.delete("/personal/:expenseId", protect, deletePersonalExpense);

export default router;
