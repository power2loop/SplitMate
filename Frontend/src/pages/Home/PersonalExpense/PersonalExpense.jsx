// PersonalExpense.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import AnalyticsChart from "./components/Analytics/AnalyticsChart";
import AIInsights from "./components/Dashboard/AIInsights";
import StatsGrid from "./components/Dashboard/StatsGrid";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import TransactionList from "./components/TransactionList/TransactionList";
import Navbar from "../../../components/Navbar/Navbar";
import "./PersonalExpense.css";

const PersonalExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on mount (and on login if token changes)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api("/expenses/personal/all");
        const normalized = (data || []).map((e) => ({
          id: e._id || e.id,
          description: e.title ?? e.description ?? "",
          amount: Number(e.amount ?? 0),
          category: e.category ?? "Other",
          date: e.date ?? e.createdAt ?? new Date().toISOString(),
        }));
        if (!cancelled) setExpenses(normalized);
      } catch (err) {
        console.error("Load expenses failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);

  const deleteExpense = async (id) => {
    const prev = expenses;
    setExpenses((p) => p.filter((e) => e.id !== id)); // optimistic
    try {
      await api(`/expenses/personal/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete failed:", err.message);
      setExpenses(prev); // revert on failure
    }
  };

  return (
    <div className="personal-expense">
      <div className="personal-expense-nav">
        <Navbar expenses={expenses} />
      </div>
      <div className="personal-expense-content">
        <div className="ai-insights">
          <AIInsights expenses={expenses} />
        </div>
        <div className="stats-grid">
          <StatsGrid expenses={expenses} />
        </div>
        <div className="dashboard-grid">
          <div className="expense-form-container">
            <ExpenseForm onAddExpense={addExpense} />
          </div>
          <div className="analytics-chart-container">
            <AnalyticsChart expenses={expenses} />
          </div>
        </div>
        <div className="transaction-list-container">
          {loading ? <div className="card-effect">Loading...</div> : <TransactionList expenses={expenses} onDeleteExpense={deleteExpense} />}
        </div>
      </div>
    </div>
  );
};

export default PersonalExpense;
