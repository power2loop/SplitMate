// controllers/GroupController.js
import crypto from "crypto";
import mongoose from "mongoose";
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js";
import Settlement from "../models/Settlement.js";
import { buildGroupAnalytics } from "../services/reportService.js";

// Helper: robust getter for a user's allocation share across Mongoose Map / plain object and ObjectId / string keys
function getShare(allocations, userIdStr) {
  if (!allocations || !userIdStr) return 0;

  // Mongoose Map path
  if (typeof allocations.get === "function") {
    let v = allocations.get(userIdStr);
    if (v == null) {
      for (const [k, val] of allocations) {
        if ((k?.toString?.() || k) === userIdStr) return Number(val) || 0;
      }
    }
    return Number(v) || 0;
  }

  // Plain object path
  if (Object.prototype.hasOwnProperty.call(allocations, userIdStr)) {
    return Number(allocations[userIdStr]) || 0;
  }
  for (const [k, val] of Object.entries(allocations)) {
    if ((k?.toString?.() || k) === userIdStr) return Number(val) || 0;
  }
  return 0;
}

// Common summarizer for group cards
function summarizeGroup(g, userIdStr) {
  const members = Array.isArray(g.members) ? g.members : [];
  const expenses = Array.isArray(g.expenses) ? g.expenses : [];

  const expensesCount = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e?.amount) || 0), 0);
  const myExpense = userIdStr
    ? expenses.reduce(
      (sum, e) => sum + (Number(getShare(e?.allocations || {}, userIdStr)) || 0),
      0
    )
    : 0;

  return {
    id: g._id?.toString(),
    name: g.name || "",
    description: g.description || "",
    members: members.map((m) => ({
      id: m._id?.toString(),
      username: m.username,
      email: m.email,
      initials: (m.username || "?").slice(0, 2).toUpperCase(),
    })),
    expensesCount,
    totalSpent,
    myExpense,
  };
}

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

    // Return raw group; FE should refetch /groups to display computed summaries
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

// GET /api/groups/mine (optional) — returns same summary shape as /api/groups
export const getMyGroups = async (req, res) => {
  try {
    const userIdStr = req.user?._id?.toString?.() || "";

    const groups = await Group.find({ members: req.user._id })
      .populate({ path: "members", select: "username email", options: { limit: 8 } })
      .populate({ path: "expenses", select: "amount allocations" })
      .lean();

    const result = (groups || []).map((g) => summarizeGroup(g, userIdStr));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/groups -> all groups for logged-in user (card summaries)
export const getAllGroup = async (req, res) => {
  try {
    const userIdStr = req.user?._id?.toString?.() || "";

    const groups = await Group.find({ members: req.user._id })
      .populate({ path: "members", select: "username email", options: { limit: 8 } })
      .populate({ path: "expenses", select: "amount allocations" }) // only fields required to compute summaries
      .lean();

    const formatted = (groups || []).map((g) => summarizeGroup(g, userIdStr));
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

// GET /api/groups/:id/analytics
export const getGroupAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid group id" });

    const group = await Group.findById(id)
      .populate("members", "username email")
      .populate({ path: "expenses", options: { sort: { date: 1, createdAt: 1 } } });

    if (!group) return res.status(404).json({ message: "Group not found" });

    const recorded = await Settlement.find({ group: group._id, status: { $in: ["completed", "posted"] } })
      .select("from to amount note createdAt");

    const currentUserId = req.user?._id?.toString?.() || null;

    const payload = buildGroupAnalytics({
      group,
      expenses: Array.isArray(group.expenses) ? group.expenses : [],
      members: Array.isArray(group.members) ? group.members : [],
      currentUserId,
      settlements: recorded || [],
    });

    return res.json(payload);
  } catch (err) {
    console.error("GET /groups/:id/analytics failed:", err);
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
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid group id" });

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
