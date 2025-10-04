import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Expense from "../models/ExpenseModel.js";
import Settlement from "../models/Settlement.js"; 
import GroupExpense from "../models/GroupModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find();
        return res.status(200).json({ success: true, message: allUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserWalletData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid userId" });

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Personal expenses
    const personalExpenses = await Expense.find({ user: objectUserId }).sort({ date: -1 });

    // 2️⃣ Groups where user is a member
    const groups = await GroupExpense.find({ members: objectUserId }).select("expenses");

    // 3️⃣ All group expense IDs
    const groupExpenseIds = groups.flatMap(g => g.expenses);

    // 4️⃣ Fetch group expenses **where user has allocations**
    const groupExpenses = await Expense.find({
      _id: { $in: groupExpenseIds },
      type: "group",
      [`allocations.${userId}`]: { $exists: true } // user has a share
    }).sort({ date: -1 });

    // 5️⃣ Map group expenses to only include logged-in user's allocation
    const userGroupExpenses = groupExpenses.map(exp => ({
      _id: exp._id,
      title: exp.title,
      amount: exp.allocations.get(userId) || 0, // only the user's allocation
      date: exp.date,
      currency: exp.currency,
      category: exp.category,
      type: "group",
      notes: exp.notes,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt
    }));

    // 6️⃣ Total investment (personal + category=Investment)
    const totalInvestment = personalExpenses
      .filter(e => e.category === "Investment")
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // 7️⃣ Total owes from settlements
    const [owePendingAgg, oweAllAgg] = await Promise.all([
      Settlement.aggregate([
        { $match: { from: objectUserId, status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { from: objectUserId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const totalOwePending = owePendingAgg[0]?.total || 0;

    // 8️⃣ Combine personal + user's allocation from groups
    const allExpenses = [...personalExpenses, ...userGroupExpenses];

    // 9️⃣ Total spent
    const totalSpent = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return res.status(200).json({
      totalSpent,
      totalInvestment,
      totalOwePending,
      expenses: allExpenses,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error("getUserWalletData error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // ✅ Generate JWT token on registration
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // ✅ Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            token
        });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const ok = user && await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Logged in",
            user: { id: user._id, username: user.username, email: user.email },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            path: "/",
        });
        return res.status(200).json({ success: true, message: "Logged out" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
