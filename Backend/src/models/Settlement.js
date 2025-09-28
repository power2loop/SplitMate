// Backend/src/models/Settlement.js
import mongoose from "mongoose";

const SettlementSchema = new mongoose.Schema(
    {
        group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // debtor
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // creditor
        amount: { type: Number, required: true, min: 0 },
        note: { type: String, default: "" },
        status: { type: String, enum: ["pending", "completed", "posted"], default: "completed" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("Settlement", SettlementSchema);
