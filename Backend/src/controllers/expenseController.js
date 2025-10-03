import mongoose from "mongoose";
import Expense from "../models/ExpenseModel.js";
import Group from "../models/GroupModel.js";

const isObjId = (v) => mongoose.Types.ObjectId.isValid(v);

const pick = (obj, keys) => Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => keys.includes(k)));

// ------------------- GROUP EXPENSES -------------------

export const createGroupExpense = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const body = pick(req.body, ["title", "amount", "date", "paidBy", "splitMethod", "allocations", "currency", "notes"]);
        if (!groupId) return res.status(400).json({ message: "group id/code missing" });

        const group = isObjId(groupId)
            ? await Group.findById(groupId)
            : await Group.findOne({ inviteCode: groupId });

        if (!group) return res.status(404).json({ message: "Group not found" });

        const exp = await Expense.create({ ...body, type: "group" });

        await Group.findByIdAndUpdate(group._id, { $push: { expenses: exp._id } });

        return res.status(201).json(exp);
    } catch (err) {
        next(err);
    }
};

export const listGroupExpenses = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = isObjId(groupId)
            ? await Group.findById(groupId).populate("expenses")
            : await Group.findOne({ inviteCode: groupId }).populate("expenses");

        if (!group) return res.status(404).json({ message: "Group not found" });
        return res.json(group.expenses || []);
    } catch (err) {
        next(err);
    }
};

export const deleteGroupExpense = async (req, res, next) => {
    try {
        const { groupId, expenseId } = req.params;

        if (!groupId) return res.status(400).json({ message: "group id/code missing" });
        if (!isObjId(expenseId)) return res.status(400).json({ message: "invalid expenseId" });

        const group = isObjId(groupId)
            ? await Group.findById(groupId).select("expenses")
            : await Group.findOne({ inviteCode: groupId }).select("expenses");

        if (!group) return res.status(404).json({ message: "Group not found" });

        // Ensure the expense belongs to this group
        const belongs = group.expenses.some((e) => e.equals(expenseId));
        if (!belongs) return res.status(404).json({ message: "Expense not in this group" });

        // Remove ref from group first
        await Group.updateOne({ _id: group._id }, { $pull: { expenses: expenseId } });

        // Delete the expense document
        const deleted = await Expense.findByIdAndDelete(expenseId);
        if (!deleted) return res.status(404).json({ message: "Expense not found" });

        return res.json({ ok: true, deletedId: expenseId });
    } catch (err) {
        next(err);
    }
};

// ------------------- PERSONAL EXPENSES -------------------

export const createPersonalExpense = async (req, res, next) => {
    try {
        const body = pick(req.body, ["title", "amount", "date", "category"]);
        const exp = await Expense.create({ ...body, type: "personal" });
        return res.status(201).json(exp);
    } catch (err) {
        next(err);
    }
};

export const listPersonalExpenses = async (_req, res, next) => {
    try {
        const expenses = await Expense.find({ type: "personal" }).sort({ createdAt: -1 });
        return res.json(expenses);
    } catch (err) {
        next(err);
    }
};

export const deletePersonalExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;

        if (!isObjId(expenseId)) return res.status(400).json({ message: "invalid expenseId" });

        const deleted = await Expense.findOneAndDelete({ _id: expenseId, type: "personal" });

        if (!deleted) return res.status(404).json({ message: "Personal expense not found" });

        return res.json({ ok: true, deletedId: expenseId });
    } catch (err) {
        next(err);
    }
};