import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Expense from "../models/ExpenseModel.js";
import Settlement from "../models/Settlement.js";
import GroupExpense from "../models/GroupModel.js";
import admin from "firebase-admin";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
  });
}

// Make sure admin is initialized via env/service account earlier (no hardcoded creds in code)

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Missing Firebase token" });

    // verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    // try find by email first
    let user = await User.findOne({ email });

    if (!user) {
      // create new user for Google sign-in
      user = await User.create({
        username: name || (email ? email.split("@")[0] : `user_${uid}`),
        email,
        password: undefined, // no password for google users
        firebaseUid: uid,
        profilePic: picture || null,
        provider: "google",
        isGoogleUser: true,
        isVerified: true
      });
    } else {
      // if user exists but not linked to firebase, link it
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.provider = user.provider || "google";
        user.isGoogleUser = true;
        user.isVerified = true;
        await user.save();
      }
    }

    // sign backend JWT (same as loginUser/registerUser)
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // set cookie to match your other endpoints
    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      token: jwtToken,
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(400).json({ message: "Google login failed", error: error.message });
  }
};


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
    // requireAuth sets req.user (a Mongoose-ish object or at least an object with id)
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    const objectUserId = new mongoose.Types.ObjectId(user._id || user.id);

    // personal expenses
    const personalExpenses = await Expense.find({ user: objectUserId }).sort({ date: -1 });

    // groups where user is member
    const groups = await GroupExpense.find({ members: objectUserId }).select("expenses");

    const groupExpenseIds = groups.flatMap(g => g.expenses || []);

    const groupExpenses = await Expense.find({
      _id: { $in: groupExpenseIds },
      type: "group",
      [`allocations.${objectUserId}`]: { $exists: true } // user has a share
    }).sort({ date: -1 });

    // Map group expenses for this user (adapt to your allocations structure)
    const userGroupExpenses = groupExpenses.map(exp => {
      // allocations could be Map or object - normalize
      const alloc = exp.allocations?.get?.(String(objectUserId)) ?? exp.allocations?.[String(objectUserId)];
      return {
        _id: exp._id,
        title: exp.title,
        amount: alloc || 0,
        date: exp.date,
        currency: exp.currency,
        category: exp.category,
        type: "group",
        notes: exp.notes,
        createdAt: exp.createdAt,
        updatedAt: exp.updatedAt
      };
    });

    const totalInvestment = personalExpenses
      .filter(e => e.category === "Investment")
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const [owePendingAgg] = await Settlement.aggregate([
      { $match: { from: objectUserId, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalOwePending = owePendingAgg?.total || 0;

    const allExpenses = [...personalExpenses, ...userGroupExpenses];

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
