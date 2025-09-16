import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";

/* ---------- Local storage helpers ---------- */
const STORAGE_KEY = "splitmate.groups";

const getStoredGroups = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};
const setStoredGroups = (arr) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch { }
};

const currency = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);


// --------------------- functions ------------



/* ---------- Modal primitives ---------- */
function Modal({ title, children, onClose }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setTimeout(() => dialogRef.current?.querySelector("input,button,select,textarea")?.focus(), 0);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-wrap" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
                <div className="modal-card">
                    <div className="modal-head">
                        <h3 id="modal-title">{title}</h3>
                        <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </>
    );
}

function JoinGroupModal({ onCancel, onSubmit }) {
    const [code, setCode] = useState("");
    const disabled = code.trim().length !== 6;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!disabled) onSubmit(code.trim());
            }}
        >
            <label className="field-label">Invite Code</label>
            <div className="field">
                <span className="field-icon">🔑</span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
            </div>

            <div className="modal-actions">
                <button type="button" className="btn ghost wide" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn primary wide" disabled={disabled}>↪ Join Group</button>
            </div>
        </form>
    );
}

function CreateGroupModal({ onCancel, onSubmit }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("Trip");
    const disabled = name.trim().length < 3;

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            if (!disabled) onSubmit({ name: name.trim(), description: desc.trim(), type });
        }}>

            <label className="field-label">Group Name</label>
            <div className="field">
                <span className="field-icon">👥</span>
                <input
                    type="text"
                    placeholder="e.g., Goa Trip 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <label className="field-label">Description (Optional)</label>
            <div className="field">
                <textarea
                    placeholder="Brief description of the group"
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
            </div>

            <label className="field-label">Group Type</label>
            <div className="field select">
                <span className="field-icon">🎒</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Family</option>
                    <option>Office collegue</option>
                    <option>Friends</option>
                    <option>Other</option>
                </select>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn ghost wide" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn primary wide" disabled={disabled}>Create Group</button>
            </div>
        </form>
    );
}

/* ---------- Main dashboard ---------- */
const Dashboard = () => {
    const [modal, setModal] = useState(null); // null | "join" | "create"
    const [groups, setGroups] = useState(() => getStoredGroups());

    // persist whenever groups change
    useEffect(() => {
        setStoredGroups(groups);
    }, [groups]);

    const addGroup = (g) => setGroups((prev) => [g, ...prev]);

    return (
        <div className="dash-root">
            {/* Header row */}
            <div className="dash-topbar">
                <h1>Your Groups</h1>
                <div className="dash-actions">
                    <button className="btn ghost" onClick={() => setModal("join")}>↪ Join Group</button>
                    <button className="btn primary" onClick={() => setModal("create")}>＋ Create Group</button>
                </div>
            </div>

            {/* Groups grid */}
            <div className="groups-grid">
                {groups.length === 0 ? (
                    <div className="empty-hint">No groups yet. Create one or join with an invite code.</div>
                ) : (
                    groups.map((g) => (
                        <button key={g.id} className="group-card" onClick={() => console.log("open group", g.id)}>
                            <div className="card-left">
                                <h3 className="group-title">{g.name}</h3>
                                <p className="group-sub">{g.description}</p>
                                <div className="group-meta">
                                    <span>👥 {g.membersCount} members</span>
                                    <span>🧾 {g.expensesCount} expenses</span>
                                </div>
                                <div className="avatars">
                                    {(g.members || []).map((m) => (
                                        <span key={m.id} className={`avatar ${m.color}`}>{m.initials}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-right">
                                <div className="total-spent">
                                    <p>Total Spent</p>
                                    <h2>{currency(g.totalSpent || 0)}</h2>
                                </div>
                                <div className="your-balance">
                                    <p>Your Balance</p>
                                    <span>{currency(g.balance || 0)}</span>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Join modal */}
            {modal === "join" && (
                <Modal title="Join Group" onClose={() => setModal(null)}>
                    <JoinGroupModal
                        onCancel={() => setModal(null)}
                        onSubmit={(code) => {
                            const joined = {
                                id: `joined-${code}`,
                                name: `Group ${code}`,
                                description: "Joined via invite code",
                                membersCount: 2,
                                expensesCount: 0,
                                totalSpent: 0,
                                balance: 0,
                                members: [{ id: "me", initials: "ME", color: "blue" }],
                            };
                            addGroup(joined);
                            setModal(null);
                        }}
                    />
                </Modal>
            )}

            {/* Create modal */}
            {modal === "create" && (
                <Modal title="Create New Group" onClose={() => setModal(null)}>
                    <CreateGroupModal
                        onCancel={() => setModal(null)}
                        onSubmit={(payload) => {
                            const id = `grp-${Date.now()}`;
                            const initials =
                                payload.name
                                    .split(" ")
                                    .map((s) => s[0]?.toUpperCase())
                                    .slice(0, 2)
                                    .join("") || "ME";

                            const newGroup = {
                                id,
                                name: payload.name,
                                description: payload.description || "",
                                membersCount: 1,
                                expensesCount: 0,
                                totalSpent: 0,
                                balance: 0,
                                members: [{ id: "me", initials, color: "green" }],
                            };

                            addGroup(newGroup);
                            setModal(null);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
