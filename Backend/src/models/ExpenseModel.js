import mongoose from "mongoose";
export const PERSONAL_CATEGORIES = Object.freeze([
    "Food & Dining",
    "Grocery",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Health & Fitness",
    "Education",
    "Travel",
    "Rent",
    "Subscriptions",
    "Others"
]);

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
        date: { type: String, default: Date.now }, // yyyy-mm-dd
        paidBy: { type: String },
        currency: { type: String, default: "INR" },
        category: { type: String, required: true, enum: PERSONAL_CATEGORIES, index: true },
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
