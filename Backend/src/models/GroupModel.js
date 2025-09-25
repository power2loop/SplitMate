// models/GroupModel.js
import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const groupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" }, // optional
    inviteCode: { type: String, unique: true, index: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    expenses: [{ type: Types.ObjectId, ref: "Expense" }],
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
