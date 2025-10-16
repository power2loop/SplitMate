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
  "type": "service_account",
  "project_id": "splitmate-f5991",
  "private_key_id": "75b3393c17a70c3ab4855a83cdc52da5637296f7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBZv+2wj4jeTbr\nuIHuWb4IpPZIf2e70HzVR7b5gs7svSIOkOS4P8T7lCZVohoqi3H3ye6a0URV3TBo\nIdgyT5Yj0UN1DpNQM4Kyex3XK7xs9cCwrjY9s7GNcP7Xu/tn9Iz7xuAXO0BgE7FT\n4g9hKHbjlTigcGtC8s0XjhUTCUunu0J3dFLhtXFPBmTeutAoNrSNlPxZck6XpUu6\n6vBA3lNvmXH0UFnNfLX/sEb3GXa+L5YCYFefEys0CjpZbF1D4o5LKq/Nl9HPvuTV\n/F72UhN74ytVH31gSm1ZrGOEsvQo0wZWfs9MLsvPYXXdVjCi8+bXquV9gcGIOIvs\nEpxu5QvNAgMBAAECggEAA+GjxNLeWVFfQN1KOXb2rS8z83l1PIAs/fyoIgXtkmbe\nYpL8Hsn5YGjGSC3Qdp8N8q92/jqwRHgU0GvKzBtr2xhMhHr1q+aVSAqCxN6G+CiS\n/knQxUMKBvuqKR9uN6I2m/4o6hkcHysZNTw6zqc7+f0oEulKZ2Sxy0koxAySTyBr\nggErkyxpxsn35XtzL/9L/Ahq834+oBJnMk5FJuxz29BWpaO3fSsfPN+SuJLHqhoa\nL6F2NFR6ohwJR+05dBGNGynixeEscm9L5tRUoTHqK6VX284KDDs/BB44GyUx1boS\n6iDk+Xey1xavkF5BaBwAJgs97rzZz1GWsfqxSIx+BQKBgQD6fFB1vpsTErj1eEAS\nXz0NEU5pAB2d4pzbjmypG4q+I6yACnJ5GMEvSG2TTly5WYcepXzMWbpNggNWDVr9\n6qoKe2arg1VybzimempznYip0qO7iiMER18l+c4tmI5lPBa+qB/xKXvdYGsisNml\ntMb1JFI2VH7LBaCNuUpjnAZgWwKBgQDFqPmXs5QADn7ekTt1KcV7ZPHYuNi/hA6C\nse/HdwV44SyNt/Fa/I0ziq+9Ha6CzeymacpdNVTqYAGWJqapxdCEwy5DHN4E1INm\nuhezl1qhw2XdHIHasA5egR5BLexxFSjxx93G9IRJzHeoXM3/MAbFXdMaSuUJtRHp\nPFWvZtZ89wKBgCDbr95SO5t76EFjHdyLG8IcFBIYDsqIUJVIkJ56W2/n1BgTxsJ1\n6dmfAajCLc2undf6U22nE5ZZSMDADcCjSN0JJQW4u7vANUk5Y7942dWVKR9P1poY\nFrYvl8lJatyCzmUCPvZuv63hmQw68MIY/cRomFRCL0PIoDAXL1fzvq5jAoGAdXeq\nfYF3n2D9/P+KumKMvnyLTiTsi0TL6tgcjAor8l6/v6llgpE8yTjOoDGXmJ0Q2wVc\nAnDDelZ8GuP1gEfTWFM2lyP8vhodzVsi4tQ8RI5/Zxyd/31JzNgnRs0oCzxsDOSe\n5LJEPCeLpT8iHVpJa9oKr0F7RH2bm2UD9y3CopkCgYA5CGdoOdoLQtkS0wBLf952\ne/jU2zfE74DGMlsFKULPg58Rp/l/2Js3ccfHsKr20vZEmHpxX4UWKozoVps2c/ti\nmWqluhtR1CAV+867ZaZncCBlquO3EPIdHOVYwmNL7F4/cVPptHC1zAslk1nH98R3\nfP3ZLY58XbcPYkvjHkNipQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@splitmate-f5991.iam.gserviceaccount.com",
  "client_id": "117907467138406036125",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40splitmate-f5991.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
),
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
