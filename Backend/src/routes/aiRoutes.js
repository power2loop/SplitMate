// src/routes/aibotRoutes.js
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/UserModel.js";
import Expense from "../models/ExpenseModel.js";
import Group from "../models/GroupModel.js";
import Settlement from "../models/Settlement.js";
import { requireAuth } from "../middlewares/UserMiddleware.js";
import { buildGroupAnalytics } from "../services/reportService.js";

const router = Router();

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

// Helper: normalize member shape for analytics
function normalizeMembers(users = []) {
  return users.map(u => ({
    _id: u._id?.toString?.() || u.id?.toString?.() || "",
    username: u.username || u.name || u.email || "Member",
    email: u.email || "",
  }));
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const { message, groupId, month } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select("username email isVerified").lean();

    // Always include quick personal context
    const recentPersonal = await Expense.find({ user: userId, type: "personal" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("_id title amount currency category date createdAt notes")
      .lean();

    // Determine target groups for deeper analytics:
    // - if groupId provided, use that one
    // - else pick up to 3 most recent groups the user is in
    const groupQuery = Group.find({ members: userId })
      .select("_id name description members createdAt")
      .sort({ createdAt: -1 });

    const baseGroups = groupId
      ? await groupQuery.where("_id").equals(groupId).lean()
      : await groupQuery.limit(3).lean();

    // Pull members for analytics context
    const memberIds = [...new Set(baseGroups.flatMap(g => g.members?.map(m => m.toString()) || []))];
    const memberDocs = memberIds.length
      ? await User.find({ _id: { $in: memberIds } }).select("_id username email").lean()
      : [];
    const memberMap = new Map(memberDocs.map(m => [m._id.toString(), m]));
    const normalizedGroupMembers = g => normalizeMembers((g.members || []).map(id => memberMap.get(id.toString())).filter(Boolean));

    // For each group, load its expenses and relevant settlements, then compute analytics
    const groupsWithAnalytics = [];
    for (const g of baseGroups) {
      const members = normalizedGroupMembers(g);

      const groupExpenses = await Expense.find({ type: "group", group: g._id })
        .sort({ createdAt: -1 })
        .limit(200) // cap context
        .select("_id title amount currency category date createdAt notes paidBy allocations splitMethod")
        .lean();

      const groupSettlements = await Settlement.find({ group: g._id })
        .sort({ createdAt: -1 })
        .limit(100)
        .select("_id from to amount note status createdAt updatedAt")
        .lean();

      const analytics = buildGroupAnalytics({
        group: { id: g._id.toString(), name: g.name },
        expenses: groupExpenses,
        members,
        currentUserId: userId.toString(),
        settlements: groupSettlements.filter(s => s.status !== "posted"),
      });

      groupsWithAnalytics.push({
        id: g._id.toString(),
        name: g.name,
        members: members.map(m => ({ id: m._id, name: m.username })),
        stats: analytics.stats,
        payers: analytics.payers,
        timelineData: analytics.timelineData,
        heatmapData: analytics.heatmapData,
        suggestions: analytics.settlements, // who should pay whom
        nets: analytics.nets, // per-member net balances
        ledgerSample: analytics.ledger.slice(0, 30), // keep prompt small
      });
    }

    const context = {
      user: { id: userId.toString(), name: user?.username || "", email: user?.email || "", isVerified: !!user?.isVerified },
      month: month || "current",
      personal: { recent: recentPersonal },
      groups: groupsWithAnalytics,
      now: new Date().toISOString(),
    };

    const system = [
      "You are SplitMate's assistant.",
      "Answer only from the provided context: user, personal expenses, group analytics (stats, nets, ledger, suggestions).",
      "If something is missing (e.g., a specific group not loaded), ask for the group name or id.",
      "For amounts, include currency when available. Keep answers concise and actionable.",
      "For ‘who owes whom’ questions, first give totals, then concrete suggested transfers if present."
    ].join(" ");

    const prompt = [
      { role: "user", parts: [{ text: JSON.stringify({ system, question: message, context }) }] }
    ];

    const result = await model.generateContent({ contents: prompt });
    const reply = await result.response.text();

    return res.json({ reply, loadedGroups: groupsWithAnalytics.map(g => ({ id: g.id, name: g.name })) });
  } catch (err) {
    console.error("AI bot error:", err);
    return res.status(500).json({ error: "AI service failed" });
  }
});


export default router;
