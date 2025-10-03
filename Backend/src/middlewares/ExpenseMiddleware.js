const EPS = 0.011;

// ---------------- Mongoose Schema-level Middleware ----------------
// export const attachExpenseValidations = (ExpenseSchema) => {
//     ExpenseSchema.pre("validate", function (next) {
//         if (this.type === "group") {
//             if (!this.splitMethod) {
//                 return next(Object.assign(new Error("splitMethod required"), { status: 400 }));
//             }

//             if (!this.allocations || this.allocations.size === 0) {
//                 return next(Object.assign(new Error("allocations required"), { status: 400 }));
//             }

//             const total = Array.from(this.allocations.values()).reduce(
//                 (a, b) => a + Number(b || 0),
//                 0
//             );

//             if (Math.abs(total - Number(this.amount)) > EPS) {
//                 return next(
//                     Object.assign(
//                         new Error(
//                             `allocations must sum to amount: got ${total.toFixed(2)} vs ${Number(
//                                 this.amount
//                             ).toFixed(2)}`
//                         ),
//                         { status: 400 }
//                     )
//                 );
//             }
//         }
//         next();
//     });
// };

// ---------------- Express Request-level Middleware ----------------
export const validateExpenseCreate = (req, res, next) => {
    const isGroup = Boolean(req.params.groupId);
    const { title, amount, date, splitMethod, allocations } = req.body || {};

    if (!title?.trim()) return res.status(400).json({ message: "title required" });
    if (!(Number(amount) > 0)) return res.status(400).json({ message: "amount must be > 0" });
    if (!date) return res.status(400).json({ message: "date required" });

    if (isGroup) {
        if (!splitMethod) return res.status(400).json({ message: "splitMethod required" });
        if (!allocations || typeof allocations !== "object") {
            return res.status(400).json({ message: "allocations required" });
        }

        const total = Object.values(allocations).reduce(
            (a, b) => a + Number(b || 0),
            0
        );

        if (Math.abs(total - Number(amount)) > EPS) {
            return res.status(400).json({ message: "allocations must sum to amount" });
        }
    }
    next();
};
