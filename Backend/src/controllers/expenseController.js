import mongoose from "mongoose";
import Expense from "../models/ExpenseModel.js";
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js"

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
// controllers/expenseController.js

export const createPersonalExpense = async (req, res, next) => {
  try {
    const body = ((obj, keys) => Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => keys.includes(k))))(
      req.body,
      ["title", "amount", "date", "category", "currency", "notes"]
    ); // allow optional fields safely [web:72]

    // Create expense with owner
    const exp = await Expense.create({
      ...body,
      type: "personal",
      user: req.user._id,
    }); // scoped creation ties expense to user [web:70]

    // Maintain back-reference on User
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { expenses: exp._id } },
      { upsert: false }
    ); // use $push to append to array; standard pattern [web:59][web:71]

    return res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
};

export const listPersonalExpenses = async (req, res, next) => {
  try {
    // CRITICAL: scope by owner to avoid exposing others' data
    const expenses = await Expense.find({
      type: "personal",
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean(); // least-privilege read + performance [web:41][web:72]

    return res.json(expenses);
  } catch (err) {
    next(err);
  }
};

export const deletePersonalExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "invalid expenseId" });
    }

    // Only delete if owned by the requester
    const deleted = await Expense.findOneAndDelete({
      _id: expenseId,
      type: "personal",
      user: req.user._id,
    }); // filter by user ensures authorization [web:41][web:72]

    if (!deleted) {
      return res.status(404).json({ message: "Personal expense not found" });
    }

    // Keep back-reference consistent
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { expenses: deleted._id } },
      { upsert: false }
    ); // remove id from user's expenses array [web:77][web:69]

    return res.json({ ok: true, deletedId: expenseId });
  } catch (err) {
    next(err);
  }
};
