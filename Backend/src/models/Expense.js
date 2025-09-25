// models/Expense.js
import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const ExpenseSchema = new Schema({
    description: String,
    amount: Number,
    paidBy: { type: Types.ObjectId, ref: "User" },
    group: { type: Types.ObjectId, ref: "Group" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
