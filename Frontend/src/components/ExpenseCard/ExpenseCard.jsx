import React, { useState, useEffect } from "react";
import "./ExpenseCard.css";

const ExpenseCard = () => {
  // ✅ Local state for live numbers
  const [expenseData, setExpenseData] = useState({
    totalSpent: 12450,
    totalSpentChange: 18.2,
    youOwe: 2340,
    youOweChange: -5.7,
    lastUpdated: new Date()
  });

  // ✅ Helper to randomize data
  const updateExpenseData = () => {
    setExpenseData({
      totalSpent: Math.floor(Math.random() * 80000) + 20000,      // ₹20k–₹100k
      totalSpentChange: +(Math.random() * 40 - 20).toFixed(1),    // -20% to +20%
      youOwe: Math.floor(Math.random() * 10000) + 500,            // ₹500–₹10.5k
      youOweChange: +(Math.random() * 20 - 10).toFixed(1),        // -10% to +10%
      lastUpdated: new Date()
    });
  };

  // ✅ Auto-refresh every 30 s
  useEffect(() => {
    const timer = setInterval(updateExpenseData, 30_000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amt) => `₹${amt.toLocaleString("en-IN")}`;
  const formatPercent = (val) => `${val >= 0 ? "+" : ""}${val}%`;

  return (
    <div className="expense-summary-card">
      <div className="expense-header">
        <div className="header-left">
          <div className="icon-container">
            <svg className="expense-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1v6m0 0l4-4m-4 4L8 3" />
              <path d="M12 23v-6m0 0l4 4m-4-4l-4 4" />
              <rect x="4" y="7" width="16" height="10" rx="2" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <h3 className="expense-title">Expense Summary</h3>
        </div>
        <div className="balance-indicator">
          <div className="balance-dot"></div>
          <span className="balance-text">
            Updated
          </span>
        </div>
      </div>

      <div className="expense-metrics">
        <div className="expense-metric-card">
          <div className="metric-label">Total Spent</div>
          <div className="metric-value">{formatCurrency(expenseData.totalSpent)}</div>
          <div
            className={`metric-change ${
              expenseData.totalSpentChange >= 0 ? "increase" : "decrease"
            }`}
          >
            {formatPercent(expenseData.totalSpentChange)}
          </div>
        </div>
        <div className="expense-metric-card">
          <div className="metric-label">You Owe</div>
          <div className="metric-value">{formatCurrency(expenseData.youOwe)}</div>
          <div
            className={`metric-change ${
              expenseData.youOweChange >= 0 ? "increase" : "decrease"
            }`}
          >
            {formatPercent(expenseData.youOweChange)}
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <button className="expense-action-btn add-expense">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Add Expense
        </button>
        <button
          className="expense-action-btn settle-up"
          onClick={updateExpenseData}    // ✅ Manual refresh
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23" />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
