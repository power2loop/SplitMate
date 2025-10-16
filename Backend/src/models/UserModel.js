// src/models/UserModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  // password can be missing for OAuth users (so not strictly required)
  password: { type: String },
  firebaseUid: { type: String, index: true, sparse: true }, // link to Firebase when present
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  settlements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Settlement' }],
  provider: { type: String, default: "email" }, // "email" | "google"
  profilePic: { type: String },
  isVerified: { type: Boolean, default: false },
  isGoogleUser: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
