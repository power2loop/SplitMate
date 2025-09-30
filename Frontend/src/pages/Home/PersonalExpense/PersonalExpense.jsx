import React, { useState } from "react";

import AnalyticsChart from "./components/Analytics/AnalyticsChart";
import AIInsights from "./components/Dashboard/AIInsights";
import StatsGrid from "./components/Dashboard/StatsGrid";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import TransactionList from "./components/TransactionList/TransactionList";

import "./PersonalExpense.css";

import Navbar from "../../../components/Navbar/Navbar";

const PersonalExpense = () => {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => setExpenses([expense, ...expenses]);
  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  return (
    <div className="personal-expense">
      <div className="personal-expense-nav">
        <Navbar expenses={expenses} />
      </div>

      <div className="personal-expense-content">
        {/* AI Insights Section */}
        <div className="ai-insights">
          <AIInsights expenses={expenses} />
        </div>

        {/* Stats Grid Section */}
        <div className="stats-grid">
          <StatsGrid expenses={expenses} />
        </div>

        {/* Dashboard Grid: Expense Form + Analytics Chart */}
        <div className="dashboard-grid">
          <div className="expense-form-container">
            <ExpenseForm onAddExpense={addExpense} />
          </div>

          <div className="analytics-chart-container">
            <AnalyticsChart expenses={expenses} />
          </div>
        </div>

        {/* Transaction List Section */}
        <div className="transaction-list-container">
          <TransactionList expenses={expenses} onDeleteExpense={deleteExpense} />
        </div>
      </div>
    </div>
  );
};

export default PersonalExpense;
