import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../../../services/api";

import "./Dashboard.css";

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
      <div
        className="geModalWrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="geModalTitle"
        ref={dialogRef}
      >
        <div className="geModalCard">
          <div className="geModalHead">
            <h3 id="geModalTitle" className="geModalTitle">
              {title}
            </h3>
            <button className="geIconBtn" aria-label="Close" onClick={onClose}>
              ✕
            </button>
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
  const onChange = (e) => {
    const hexOnly = e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 12);
    setCode(hexOnly);
  };
  const isValid = /^[0-9a-f]{12}$/i.test(code); // exactly 12 hex
  return (
    <form
      className="geForm"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onSubmit(code);
      }}
    >
      <label className="geFieldLabel">Invite Code</label>
      <div className="geField">
        <span className="geFieldIcon">🔑</span>
        <input
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          pattern="[0-9a-fA-F]{12}"
          title="12-character hex code"
          value={code}
          onChange={onChange}
          className="geInput"
          placeholder="e.g., a1b2c3d4e5f6"
        />
      </div>

      <div className="geModalActions">
        <button type="button" className="geBtn geBtnGhost geBtnWide" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="geBtn geBtnPrimary geBtnWide" disabled={!isValid}>
          ↪ Join Group
        </button>
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
        <button type="button" className="geBtn geBtnGhost geBtnWide" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="geBtn geBtnPrimary geBtnWide" disabled={disabled}>
          Create Group
        </button>
      </div>
    </form>
  );
}

/* ---------- Data shapers ---------- */
const shapeMember = (m) => ({
  id: (
    m?.id ??
    m?._id ??
    m?.userId ??
    m?.email ??
    m?.username ??
    Math.random().toString(36)
  ).toString(),
  initials: (m?.username || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  color: m?.color || "blue",
});

const shapeGroup = (g) => ({
  id: (g?.id ?? g?._id ?? g?.inviteCode)?.toString(),
  name: g?.name || "",
  description: g?.description || "",
  members: Array.isArray(g?.members) ? g.members.map(shapeMember) : [],
  expensesCount: g?.expensesCount ?? 0,
  totalSpent: g?.totalSpent ?? 0,
  balance: g?.balance ?? 0,
});

/* ---------- Main Dashboard ---------- */
const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  // StrictMode guard to avoid double fetch in dev
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    api("/groups")
      .then((rows) => {
        // normalize + dedupe by id
        const shaped = rows.map(shapeGroup);
        const byId = new Map(shaped.map((g) => [g.id, g]));
        setGroups(Array.from(byId.values()));
      })
      .catch((err) => console.error("Failed to fetch groups", err));
  }, []);

  const upsertGroup = useCallback((incoming) => {
    setGroups((prev) => {
      const map = new Map(prev.map((g) => [g.id, g]));
      map.set(incoming.id, incoming);
      return Array.from(map.values());
    });
  }, []);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        const data = await api("/groups", { method: "POST", body: JSON.stringify(payload) });
        upsertGroup(shapeGroup(data.group));
        setModal(null);
      } catch (e) {
        alert(e.message);
      }
    },
    [upsertGroup]
  );

  const handleJoin = useCallback(
    async (inviteCode) => {
      try {
        const raw = await api(`/groups/join/${inviteCode}`, { method: "POST" });
        upsertGroup(shapeGroup(raw));
        setModal(null);
      } catch (e) {
        alert(e.message);
      }
    },
    [upsertGroup]
  );

  return (
    <div className="geRoot">
      <div className="geBlob geBlobLeft" />
      <div className="geBlob geBlobRight" />

      {/* Header */}
      <div className="geTopBar">
        <h1 className="geTitle">Your Groups</h1>
        <div className="geActions">
          <button className="geBtn geBtnGhost" onClick={() => setModal("join")}>
            ↪ Join Group
          </button>
          <button className="geBtn geBtnPrimary" onClick={() => setModal("create")}>
            ＋ Create Group
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="geGrid">
        {groups.length === 0 ? (
          <div className="geEmpty">No groups yet. Create one or join with an invite code.</div>
        ) : (
          groups.map((g) => (
            <button key={g.id} className="geCard" onClick={() => navigate(`details/${g.id}`)}>
              <div className="geCardLeft">
                <h3 className="geCardTitle">{g.name}</h3>
                <p className="geCardSub">{g.description}</p>
                <div className="geCardMeta">
                  <span>👥 {g.members?.length || 0} members</span>
                  <span>🧾 {g.expensesCount || 0} expenses</span>
                </div>
                <div className="geAvatars">
                  {(g.members || []).map((m) => (
                    <span key={m.id} className={`geAvatar ${m.color || "blue"}`}>
                      {m.initials}
                    </span>
                  ))}
                </div>
              </div>

              <div className="geCardRight">
                <div>
                  <p className="geHint">Total Spent</p>
                  <h2 className="geAmount">{g.totalSpent ?? 0}</h2>
                </div>
                <div>
                  <p className="geHint">Your Balance</p>
                  <span className="geBadge">{g.balance ?? 0}</span>
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
