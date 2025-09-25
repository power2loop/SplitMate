import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { api } from "../../../../../services/api";
import "./Dashboard.css";

/* ---------- Helpers ---------- */
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
          pattern="\d{6}"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.slice(0, 6))}
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

/* ---------- Main Dashboard ---------- */
const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  // Fetch groups on mount
  useEffect(() => {
    api("/groups")
      .then(setGroups)
      .catch(err => console.error("Failed to fetch groups", err));
  }, []);

  const handleCreate = async (payload) => {
    try {
      const data = await api("/groups", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setGroups(prev => [data.group, ...prev]);
      setModal(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleJoin = async (inviteCode) => {
    try {
      const g = await api(`/groups/join/${inviteCode}`, { method: "POST" });
      setGroups(prev => {
        if (prev.find(group => group.id === g.id)) return prev; // avoid duplicates
        return [g, ...prev];
      });
      setModal(null);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="geRoot">
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
          groups.map(g => (
            <button
              key={g.id}
              className="geCard"
              onClick={() => navigate(`details/${g.id}`)}
            >
              <div className="geCardLeft">
                <h3 className="geCardTitle">{g.name}</h3>
                <p className="geCardSub">{g.description}</p>
                <div className="geCardMeta">
                  <span>👥 {g.members?.length || 0} members</span>
                  <span>🧾 {g.expensesCount || 0} expenses</span>
                </div>
                <div className="geAvatars">
                  {(g.members || []).map(m => (
                    <span key={m.id} className={`geAvatar ${m.color || "blue"}`}>
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
          <JoinGroupModal onCancel={() => setModal(null)} onSubmit={handleJoin} />
        </Modal>
      )}

      {modal === "create" && (
        <Modal title="Create New Group" onClose={() => setModal(null)}>
          <CreateGroupModal onCancel={() => setModal(null)} onSubmit={handleCreate} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
