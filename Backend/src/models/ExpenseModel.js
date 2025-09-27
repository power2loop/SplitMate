import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["personal", "group"],
            required: true,
            default: function () {
                return this.allocations?.size > 0 || this.splitMethod ? "group" : "personal";
            }
        },
        title: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 0.01 },
        date: { type: String, required: true }, // yyyy-mm-dd
        paidBy: { type: String },
        currency: { type: String, default: "INR" },
        category: { type: String },
        notes: { type: String, default: "" },
        splitMethod: { type: String, enum: ["equal", "custom", "percent"] },
        allocations: { type: Map, of: Number }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                if (ret.allocations instanceof Map) ret.allocations = Object.fromEntries(ret.allocations);
                return ret;
            }
        }
    }
);

ExpenseSchema.index({ type: 1, createdAt: -1 });

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
export { ExpenseSchema };
