// src/components/AllExpenses.jsx
import React, { useEffect, useMemo, useState } from "react";

import "./AllExpense.css";

import { CgArrowsExpandRight } from "react-icons/cg";
import { MdDeleteForever } from "react-icons/md";

import Loader from "../../../../../../components/Loader/Loader.jsx";
import { api } from "../../../../../../services/api.js";

const Expense = ({
  id,
  title = "Untitled expense",
  payer = "Unknown",
  date = "",
  amount = 0,
  iconBg = "#8B5CF6",
  icon = "🧾",
  splitMethod = "equal",
  participants = [],
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const splitId = `split-${id}`;

  return (
    <div className="expense-row">
      <div className="left">
        <div className="thumb" style={{ backgroundColor: iconBg }}>
          <span className="thumb-icon">{icon}</span>
        </div>

        <div className="texts">
          <div className="title-row">
            <div className="title">{title}</div>
            <button
              type="button"
              className="split-toggle-btn"
              aria-expanded={open}
              aria-controls={splitId}
              onClick={() => setOpen((v) => !v)}
              title="Show split details"
            >
              <CgArrowsExpandRight
                className={open ? "rotated" : ""}
                style={{ fontWeight: "bold" }}
              />
            </button>
          </div>

          <div className="sub">
            {payer ? `Paid by ${payer}` : "Paid by —"}
            {date ? ` • ${date}` : ""}
          </div>

          {open && (
            <div id={splitId} className="split-dropdown" role="region">
              <div className="split-line" style={{ fontWeight: "600" }}>
                {`Split Method : ${splitMethod} Participant : ${
                  participants.length > 0 ? participants.join(", ") : "no participants"
                }`}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <div className="amt">₹{amount}</div>
        <button className="delete-btn" onClick={() => onDelete?.(id)}>
          <MdDeleteForever />
        </button>
      </div>
    </div>
  );
};

const ExpenseList = ({ items = [], onDelete }) => (
  <div className="expense-card">
    <div className="header">All Expenses</div>
    <div className="list" id="expenses">
      {items.map((e) => (
        <Expense key={e.id} {...e} onDelete={onDelete} />
      ))}
    </div>
  </div>
);

const AllExpenses = ({ groupId, members = [], lastCreated = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // id -> name map
  const nameById = useMemo(() => {
    const m = {};
    for (const x of members) {
      const id = (x.id ?? x._id ?? x.userId ?? x.email ?? "").toString();
      const name = x.name ?? x.username ?? x.email ?? "Member";
      if (id) m[id] = name;
    }
    return m;
  }, [members]);

  // API -> UI normalize with participant filtering
  function toUi(e) {
    const id = e._id || e.id;
    const payer = nameById[e.paidBy] || e.paidBy || "Unknown";

    const when = e.date || e.createdAt;
    const date = when
      ? new Date(when).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    const allocations = e.allocations || {};
    const splitMethod = e.splitMethod || "equal";

    const rawParticipantIds =
      Array.isArray(e.participants) && e.participants.length > 0
        ? e.participants
        : Object.entries(allocations)
            .filter(([uid, val]) => {
              if (val == null) return false;
              const t = typeof val;
              if (t === "number") return Number(val) > 0;
              if (t === "boolean") return val === true;
              if (t === "object") {
                if ("included" in val) return Boolean(val.included);
                if ("share" in val) return Number(val.share) > 0;
                if ("amount" in val) return Number(val.amount) > 0;
              }
              return true;
            })
            .map(([uid]) => uid);

    const participants =
      rawParticipantIds.length > 0 ? rawParticipantIds.map((uid) => nameById[uid] || uid) : [];

    return {
      id,
      title: e.title || "Untitled expense",
      payer,
      date,
      amount: e.amount ?? 0,
      icon: "🧾",
      iconBg: "#8B5CF6",
      splitMethod,
      participants,
    };
  }

  async function load() {
    if (!groupId) return;
    setLoading(true);
    try {
      const list = await api(`/expenses/group/${encodeURIComponent(groupId)}`);
      setItems((list || []).map(toUi));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  useEffect(() => {
    load();
  }, [groupId]);

  const handleDelete = async (id) => {
    try {
      await api(`/expenses/group/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  useEffect(() => {
    if (lastCreated && (lastCreated._id || lastCreated.id)) {
      const createdId = lastCreated._id || lastCreated.id;
      setItems((prev) => {
        const next = [toUi(lastCreated), ...prev.filter((x) => x.id !== createdId)];
        return next;
      });
    }
  }, [lastCreated, nameById]);

  if (!groupId) return <div className="expense-demo-page">No group selected</div>;

  return (
    <div className="expense-demo-page">
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <ExpenseList items={items} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AllExpenses;
