// controllers/GroupController.js
import crypto from "crypto";
import mongoose from "mongoose"; // NEW: for isValidObjectId guard
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js";
import Expense from "../models/ExpenseModel.js"; // optional; only if you use it
import Settlement from "../models/Settlement.js"; // NEW: used in analytics/settlements
import { buildGroupAnalytics } from "../services/reportService.js";

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const inviteCode = crypto.randomBytes(6).toString("hex");

    const group = await Group.create({
      name,
      description,
      inviteCode,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { groups: group._id } });
    res.status(201).json({ groupId: group._id, group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/groups/join/:code
export const joinGroup = async (req, res) => {
  try {
    const { code } = req.params;
    const group = await Group.findOne({ inviteCode: code });
    if (!group) return res.status(404).json({ message: "Invalid invite code" });

    const alreadyMember = group.members.some((m) => m.equals(req.user._id));
    if (!alreadyMember) {
      group.members.push(req.user._id);
      await group.save();
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups: group._id } });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/groups/:id
export const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "username email")
      .populate("createdBy", "username")
      .populate("expenses");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyGroups = async (req, res) => {
  const userId = req.user._id;
  const groups = await Group.find({ members: userId })
    .select("name description type expensesCount totalSpent members createdBy")
    .populate({ path: "members", select: "username", options: { limit: 8 } })
    .populate({ path: "createdBy", select: "username" });
  return res.status(200).json(groups);
};

// GET /api/groups -> all groups for logged-in user
export const getAllGroup = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "username email")
      .populate("expenses");

    const formatted = groups.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      description: g.description,
      members: g.members.map((m) => ({
        id: m._id.toString(),
        username: m.username,
        email: m.email,
        initials: m.username?.slice(0, 2).toUpperCase(),
      })),
      expensesCount: g.expenses?.length || 0,
      totalSpent: g.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0),
      balance: 0,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/groups/:id
export const DeleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only creator can delete" });
    }

    await User.updateMany({ groups: group._id }, { $pull: { groups: group._id } });
    await group.deleteOne();
    return res.json({ message: "Group deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/groups/:id/leave
export const LeaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.createdBy.equals(req.user._id)) {
      return res.status(400).json({ message: "Creator cannot leave; delete the group instead" });
    }

    const isMember = group.members.some((m) => m.equals(req.user._id));
    if (!isMember) return res.status(400).json({ message: "Not a member" });

    await Group.updateOne({ _id: group._id }, { $pull: { members: req.user._id } });
    await User.updateOne({ _id: req.user._id }, { $pull: { groups: group._id } });

    const updated = await Group.findById(group._id).select("members");
    if (updated && updated.members.length === 0) {
      await Group.deleteOne({ _id: group._id });
    }

    return res.json({ message: "Left group" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const getGroupAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid group id" }); // guard [web:19]

    const group = await Group.findById(id)
      .populate("members", "username email")
      .populate({ path: "expenses", options: { sort: { date: 1, createdAt: 1 } } }); // chronological [web:202]

    if (!group) return res.status(404).json({ message: "Group not found" });

    const recorded = await Settlement.find({ group: group._id, status: { $in: ["completed", "posted"] } })
      .select("from to amount note createdAt"); // payments included [web:218]

    const currentUserId = req.user?._id?.toString?.() || null;

    const payload = buildGroupAnalytics({
      group,
      expenses: Array.isArray(group.expenses) ? group.expenses : [],
      members: Array.isArray(group.members) ? group.members : [],
      currentUserId,
      settlements: recorded || [],
    }); // includes ledger and nets [web:202]

    return res.json(payload);
  } catch (err) {
    console.error("GET /groups/:id/analytics failed:", err); // log for debugging [web:221]
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /api/groups/:id/settlements
export const recordSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromId, toId, amount, note } = req.body || {};
    if (!fromId || !toId || !(Number(amount) > 0)) {
      return res.status(400).json({ message: "fromId, toId and positive amount are required" });
    }
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid group id" }); // guard [web:19]

    const group = await Group.findById(id).select("members");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const inGroup = (mId) => group.members.some((m) => m.equals(mId));
    if (!inGroup(fromId) || !inGroup(toId)) {
      return res.status(400).json({ message: "Both members must belong to the group" });
    }

    const doc = await Settlement.create({
      group: id,
      from: fromId,
      to: toId,
      amount: Number(amount),
      note: note || "",
      status: "completed",
      createdBy: req.user?._id,
      createdAt: new Date(),
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("POST /groups/:id/settlements failed:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};