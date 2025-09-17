import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom';
import "./GroupExpenseDashboard.css";

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

/* ---------- Modal primitive ---------- */
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
            <div className="geModalBackdrop" onClick={onClose} />
            <div className="geModalWrap" role="dialog" aria-modal="true" aria-labelledby="geModalTitle" ref={dialogRef}>
                <div className="geModalCard">
                    <div className="geModalHead">
                        <h3 id="geModalTitle" className="geModalTitle">{title}</h3>
                        <button className="geIconBtn" aria-label="Close" onClick={onClose}>✕</button>
                    </div>
                    <div className="geModalBody">{children}</div>
                </div>
            </div>
        </>
    );
}

/* ---------- Join Group Modal ---------- */
function JoinGroupModal({ onCancel, onSubmit }) {
    const [code, setCode] = useState("");
    const disabled = code.trim().length !== 6;

    return (
        <form
            className="geForm"
            onSubmit={(e) => {
                e.preventDefault();
                if (!disabled) onSubmit(code.trim());
            }}
        >
            <label className="geFieldLabel">Invite Code</label>
            <div className="geField">
                <span className="geFieldIcon">🔑</span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="geInput"
                />
            </div>

            <div className="geModalActions">
                <button type="button" className="geBtn geBtnGhost geBtnWide" onClick={onCancel}>Cancel</button>
                <button type="submit" className="geBtn geBtnPrimary geBtnWide" disabled={disabled}>↪ Join Group</button>
            </div>
        </form>
    );
}

/* ---------- Create Group Modal ---------- */
function CreateGroupModal({ onCancel, onSubmit }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("Family");
    const disabled = name.trim().length < 3;

    return (
        <form
            className="geForm"
            onSubmit={(e) => {
                e.preventDefault();
                if (!disabled) onSubmit({ name: name.trim(), description: desc.trim(), type });
            }}
        >
            <label className="geFieldLabel">Group Name</label>
            <div className="geField">
                <span className="geFieldIcon">👥</span>
                <input
                    type="text"
                    placeholder="e.g., Goa Trip 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="geInput"
                />
            </div>

            <label className="geFieldLabel">Description (Optional)</label>
            <div className="geField">
                <textarea
                    placeholder="Brief description of the group"
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="geTextarea"
                />
            </div>

            <label className="geFieldLabel">Group Type</label>
            <div className="geField geSelect">
                <span className="geFieldIcon">🎒</span>
                <select value={type} onChange={(e) => setType(e.target.value)} className="geSelectEl">
                    <option>Family</option>
                    <option>Office collegue</option>
                    <option>Friends</option>
                    <option>Other</option>
                </select>
            </div>

            <div className="geModalActions">
                <button type="button" className="geBtn geBtnGhost geBtnWide" onClick={onCancel}>Cancel</button>
                <button type="submit" className="geBtn geBtnPrimary geBtnWide" disabled={disabled}>Create Group</button>
            </div>
        </form>
    );
}

/* ---------- Main dashboard ---------- */
const Dashboard = () => {
    const [modal, setModal] = useState(null); // null | "join" | "create"
    const [groups, setGroups] = useState(() => getStoredGroups());

    const navigate = useNavigate(); 

    // persist whenever groups change
    useEffect(() => {
        setStoredGroups(groups);
    }, [groups]);
    useEffect(() => { setStoredGroups(groups); }, [groups]);
    const addGroup = (g) => setGroups((prev) => [g, ...prev]);

    return (
        <div className="geRoot">
            {/* soft blobs */}
            <div className="geBlob geBlobLeft" />
            <div className="geBlob geBlobRight" />

            {/* Header */}
            <div className="geTopBar">
                <h1 className="geTitle">Your Groups</h1>
                <div className="geActions">
                    <button className="geBtn geBtnGhost" onClick={() => setModal("join")}>↪ Join Group</button>
                    <button className="geBtn geBtnPrimary" onClick={() => setModal("create")}>＋ Create Group</button>
                </div>
            </div>

            {/* Groups */}
<div className="geGrid">
  {groups.length === 0 ? (
    <div className="geEmpty">
      No groups yet. Create one or join with an invite code.
    </div>
  ) : (
    groups.map((g) => (
      <button
        key={g.id}
        className="geCard"
        onClick={() => navigate(`details/${g.id}`)}
      >
        <div className="geCardLeft">
          <h3 className="geCardTitle">{g.name}</h3>
          <p className="geCardSub">{g.description}</p>
          <div className="geCardMeta">
            <span>👥 {g.membersCount} members</span>
            <span>🧾 {g.expensesCount} expenses</span>
          </div>
          <div className="geAvatars">
            {(g.members || []).map((m) => (
              <span
                key={m.id}
                className={`geAvatar ${m.color || "blue"}`}
              >
                {m.initials}
              </span>
            ))}
          </div>
        </div>

        <div className="geCardRight">
          <div>
            <p className="geHint">Total Spent</p>
            <h2 className="geAmount">{currency(g.totalSpent || 0)}</h2>
          </div>
          <div>
            <p className="geHint">Your Balance</p>
            <span className="geBadge">{currency(g.balance || 0)}</span>
          </div>
        </div>
      </button>
    ))
  )}
</div>

            

            {/* Modals */}
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
