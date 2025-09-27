// src/components/AddExpenseModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../../../services/api.js"; // adjust path if needed
import "./AddExpenseModal.css";

export default function AddExpenseModal({
    open,
    onClose,
    members = [],
    onAdd,
    groupId,         // pass ObjectId or inviteCode
    mode = "group",  // "group" | "personal"
}) {
    const dialogRef = useRef(null);

    // Normalize members to {id, name}
    const normMembers = useMemo(
        () =>
            (members || []).map((m) => ({
                id: (m.id ?? m._id ?? m.userId ?? m.email ?? Math.random().toString(36)).toString(),
                name: m.name ?? m.username ?? m.email ?? "Member",
            })),
        [members]
    );

    // form fields
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [payerId, setPayerId] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

    // default payer
    const defaultPayer = useMemo(() => {
        const you = normMembers.find((m) => m.name === "You")?.id;
        return you ?? normMembers[0]?.id ?? "";
    }, [normMembers]);

    // split state
    const [method, setMethod] = useState("equal"); // equal | custom | percent
    const emptyMap = useMemo(() => Object.fromEntries(normMembers.map((m) => [m.id, 0])), [normMembers]);
    const [customAmounts, setCustomAmounts] = useState(emptyMap);
    const [percents, setPercents] = useState(emptyMap);

    // Reset all controlled inputs to initial values
    const resetForm = () => {
        setTitle("");
        setAmount("");
        setMethod("equal");
        setCustomAmounts(Object.fromEntries(normMembers.map((m) => [m.id, 0])));
        setPercents(Object.fromEntries(normMembers.map((m) => [m.id, 0])));
        setPayerId(defaultPayer || "");
        setDate(new Date().toISOString().split("T")[0]);
    };

    // open lifecycle
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";

        // Start fresh every time the modal opens
        resetForm();

        const first = dialogRef.current?.querySelector("input,select,button");
        first?.focus();

        const onKey = (e) => { if (e.key === "Escape") { resetForm(); onClose?.(); } };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [open, normMembers, defaultPayer, onClose]);

    // keep payer valid as members change
    useEffect(() => {
        if (!normMembers.some((m) => m.id === payerId)) {
            setPayerId(defaultPayer);
        }
    }, [normMembers, payerId, defaultPayer]);

    // helpers
    const amtNum = Number(amount) || 0;
    const equalEach = useMemo(() => {
        const n = Math.max(normMembers.length, 1);
        return Math.round((amtNum / n) * 100) / 100;
    }, [amtNum, normMembers.length]);

    const customSum = useMemo(
        () => Object.values(customAmounts).reduce((a, b) => a + (Number(b) || 0), 0),
        [customAmounts]
    );

    const percentSum = useMemo(
        () => Object.values(percents).reduce((a, b) => a + (Number(b) || 0), 0),
        [percents]
    );

    const isValid =
        title.trim() &&
        amtNum > 0 &&
        payerId &&
        (method === "equal" ||
            (method === "custom" && Math.round(customSum * 100) === Math.round(amtNum * 100)) ||
            (method === "percent" && Math.round(percentSum) === 100));

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) {
            resetForm();
            onClose?.();
        }
    };

    const setCustom = (id, v) => setCustomAmounts((prev) => ({ ...prev, [id]: Number(v) || 0 }));
    const setPercent = (id, v) =>
        setPercents((prev) => ({ ...prev, [id]: Math.max(0, Math.min(100, Number(v) || 0)) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        // build allocations for backend
        let allocations = {};
        if (method === "equal") {
            allocations = Object.fromEntries(normMembers.map((m) => [m.id, equalEach]));
            const total = Object.values(allocations).reduce((a, b) => a + b, 0);
            const diff = Math.round((amtNum - total) * 100) / 100;
            if (normMembers[0]) {
                allocations[normMembers[0].id] = Math.round((allocations[normMembers[0].id] + diff) * 100) / 100;
            }
        } else if (method === "custom") {
            allocations = Object.fromEntries(normMembers.map((m) => [m.id, Number(customAmounts[m.id] || 0)]));
        } else {
            allocations = Object.fromEntries(
                normMembers.map((m) => {
                    const pct = Number(percents[m.id] || 0);
                    const val = Math.round(((amtNum * pct) / 100) * 100) / 100;
                    return [m.id, val];
                })
            );
            const total = Object.values(allocations).reduce((a, b) => a + b, 0);
            const diff = Math.round((amtNum - total) * 100) / 100;
            if (normMembers[0]) {
                allocations[normMembers[0].id] = Math.round((allocations[normMembers[0].id] + diff) * 100) / 100;
            }
        }

        // backend payloads
        const base = { title: title.trim(), amount: amtNum, date, paidBy: payerId };
        const groupPayload = { ...base, splitMethod: method, allocations };
        const personalPayload = { ...base, currency: "INR", category: "General" };

        try {
            const created =
                mode === "group"
                    ? await api(`/expenses/group/${encodeURIComponent(groupId)}`, { method: "POST", body: groupPayload })
                    : await api(`/expenses/personal`, { method: "POST", body: personalPayload });

            onAdd?.(created);

            // Reset the form to initial values and close
            resetForm();
            onClose?.();
        } catch (err) {
            alert(err.message || "Failed to save expense");
        }
    };

    if (!open) return null;

    return (
        <div className="expense-backdrop" onClick={handleBackdrop}>
            <div ref={dialogRef} className="expense-dialog" role="dialog" aria-modal="true">
                <div className="expense-header">
                    <h3>Add Group Expense</h3>
                    <button
                        className="expense-close"
                        onClick={() => { resetForm(); onClose?.(); }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="expense-body">
                        <div className="grid-2">
                            <div className="field">
                                <label>What was this for?</label>
                                <input
                                    type="text"
                                    placeholder="Describe the expense"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label>Amount <span>(Rs)</span></label>
                                <div className="input-with-prefix-amount">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid-2">
                            <div className="field">
                                <label>Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Paid By</label>
                                <select value={payerId} onChange={(e) => setPayerId(e.target.value)}>
                                    {normMembers.length === 0 ? (
                                        <option value="" disabled>No members</option>
                                    ) : (
                                        normMembers.map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label>Split Method</label>
                            <div className="split-methods">
                                <button type="button" className={`split-tile ${method === "equal" ? "active" : ""}`} onClick={() => setMethod("equal")}>
                                    <div className="icon">=</div>
                                    <div><div className="tile-sub">Split equally</div></div>
                                </button>

                                <button type="button" className={`split-tile ${method === "custom" ? "active" : ""}`} onClick={() => setMethod("custom")}>
                                    <div className="icon">✎</div>
                                    <div><div className="tile-sub">Custom amounts</div></div>
                                </button>

                                <button type="button" className={`split-tile ${method === "percent" ? "active" : ""}`} onClick={() => setMethod("percent")}>
                                    <div className="icon">%</div>
                                    <div><div className="tile-sub">By percentage</div></div>
                                </button>
                            </div>
                        </div>

                        {method === "equal" && (
                            <div className="equal-info">Each pays Rs {isNaN(equalEach) ? "0.00" : equalEach.toFixed(2)}</div>
                        )}

                        {method === "custom" && (
                            <div className="split-list">
                                {normMembers.map((m) => (
                                    <div key={m.id} className="split-row">
                                        <span className="who">{m.name}</span>
                                        <div className="input-with-prefix small">
                                            <span>Rs</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={customAmounts[m.id]}
                                                onChange={(e) => setCustom(m.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className={`sum-row ${Math.round(customSum * 100) !== Math.round(amtNum * 100) ? "err" : ""}`}>
                                    Sum: Rs {customSum.toFixed(2)} / Rs {amtNum.toFixed(2)}
                                </div>
                            </div>
                        )}

                        {method === "percent" && (
                            <div className="split-list">
                                {normMembers.map((m) => (
                                    <div key={m.id} className="split-row">
                                        <span className="who">{m.name}</span>
                                        <div className="input-with-suffix small">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={percents[m.id]}
                                                onChange={(e) => setPercent(m.id, e.target.value)}
                                            />
                                            <span>%</span>
                                        </div>
                                    </div>
                                ))}
                                <div className={`sum-row ${Math.round(percentSum) !== 100 ? "err" : ""}`}>
                                    Total: {percentSum}% (must be 100%)
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="expense-footer">
                        <button
                            type="button"
                            className="btn cancel"
                            onClick={() => { resetForm(); onClose?.(); }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn primary" disabled={!isValid}>
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
