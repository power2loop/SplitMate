// src/components/AllExpenses.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./AllExpense.css";
import { api } from "../../../../../../services/api.js";
import { MdDeleteForever } from "react-icons/md";
import Loader from "../../../../../../components/Loader/Loader.jsx";

const Expense = ({
  id,
  title = "Untitled expense",
  payer = "Unknown",
  date = "",
  amount = 0,
  iconBg = "#8B5CF6",
  icon = "🧾",
  onDelete,
}) => {
  return (
    <div className="expense-row">
      <div className="left">
        <div className="thumb" style={{ backgroundColor: iconBg }}>
          <span className="thumb-icon">{icon}</span>
        </div>
        <div className="texts">
          <div className="title">{title}</div>
          <div className="sub">
            {payer ? `Paid by ${payer}` : "Paid by —"}
            {date ? ` • ${date}` : ""}
          </div>
        </div>
      </div>
      <div className="right">
        <div className="amt">₹{amount}</div>
        <button className="delete-btn" onClick={() => onDelete?.(id)}><MdDeleteForever />

        </button>
      </div>
    </div>
  );
};

const ExpenseList = ({ items = [], onDelete }) => (
  <div className="expense-card">
    <div className="header">All Expenses</div>
    <div className="list" id="expenses">
      {items.map((e) => <Expense key={e.id} {...e} onDelete={onDelete} />)}
    </div>
  </div>
);

const AllExpenses = ({ groupId, members = [], lastCreated = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const nameById = useMemo(() => {
    const m = {};
    for (const x of members) {
      const id = (x.id ?? x._id ?? x.userId ?? x.email ?? "").toString();
      const name = x.name ?? x.username ?? x.email ?? "Member";
      if (id) m[id] = name;
    }
    return m;
  }, [members]);

  function toUi(e) {
    const id = e._id || e.id;
    const payer = nameById[e.paidBy] || e.paidBy || "Unknown";
    const when = e.date || e.createdAt;
    const date =
      when ? new Date(when).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
    return {
      id,
      title: e.title || "Untitled expense",
      payer,
      date,
      amount: e.amount ?? 0,
      icon: "🧾",
      iconBg: "#8B5CF6",
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

  // Load on mount / group change
  useEffect(() => {
    load();
  }, [groupId]);

  const handleDelete = async (id) => {
    try {
      await api(`/expenses/group/${encodeURIComponent(groupId)}/${encodeURIComponent(id)}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  // Prepend the latest created item from parent without refetch (optimistic UI)
  useEffect(() => {
    if (lastCreated && (lastCreated._id || lastCreated.id)) {
      const createdId = lastCreated._id || lastCreated.id;
      setItems((prev) => {
        const next = [toUi(lastCreated), ...prev.filter((x) => x.id !== createdId)];
        return next;
      });
    }
  }, [lastCreated, nameById]); // include nameById so payer label updates if members change

  if (!groupId) return <div className="expense-demo-page">No group selected</div>;

  return (
    <div className="expense-demo-page">
      {loading ? <div><Loader /></div> : <ExpenseList items={items} onDelete={handleDelete} />}
    </div>
  );
};

export default AllExpenses;
