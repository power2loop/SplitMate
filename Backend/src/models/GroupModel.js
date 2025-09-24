import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  inviteCode: { type: String, unique: true },        // generated code to join group
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);
export default Group;
