import React, { useEffect, useState } from "react";

import "./ExpenseCard.css";

const ExpenseCard = () => {
  const [expenseData, setExpenseData] = useState({
    totalSpent: 12450,
    totalSpentChange: 18.2,
    youOwe: 2340,
    youOweChange: -5.7,
    lastUpdated: new Date(),
  });

  const updateExpenseData = () => {
    setExpenseData({
      totalSpent: Math.floor(Math.random() * 80000) + 20000,
      totalSpentChange: +(Math.random() * 40 - 20).toFixed(1),
      youOwe: Math.floor(Math.random() * 10000) + 500,
      youOweChange: +(Math.random() * 20 - 10).toFixed(1),
      lastUpdated: new Date(),
    });
  };

  useEffect(() => {
    const timer = setInterval(updateExpenseData, 30_000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amt) => `₹${amt.toLocaleString("en-IN")}`;
  const formatPercent = (val) => `${val >= 0 ? "+" : ""}${val}%`;

  return (
    <div className="ec-summary-card">
      <div className="ec-header">
        <div className="ec-header-left">
          <div className="ec-icon-container">
            <svg className="ec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1v6m0 0l4-4m-4 4L8 3" />
              <path d="M12 23v-6m0 0l4 4m-4-4l-4 4" />
              <rect x="4" y="7" width="16" height="10" rx="2" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <h3 className="ec-title">Expense Summary</h3>
        </div>
        <div className="ec-balance-indicator">
          <div className="ec-balance-dot"></div>
          <span className="ec-balance-text">Updated</span>
        </div>
      </div>

      <div className="ec-metrics">
        <div className="ec-metric-card">
          <div className="ec-metric-label">Total Spent</div>
          <div className="ec-metric-value">{formatCurrency(expenseData.totalSpent)}</div>
          <div
            className={`ec-metric-change ${expenseData.totalSpentChange >= 0 ? "ec-increase" : "ec-decrease"}`}
          >
            {formatPercent(expenseData.totalSpentChange)}
          </div>
        </div>
        <div className="ec-metric-card">
          <div className="ec-metric-label">You Owe</div>
          <div className="ec-metric-value">{formatCurrency(expenseData.youOwe)}</div>
          <div
            className={`ec-metric-change ${expenseData.youOweChange >= 0 ? "ec-increase" : "ec-decrease"}`}
          >
            {formatPercent(expenseData.youOweChange)}
          </div>
        </div>
      </div>

      <div className="ec-actions">
        <button className="ec-btn ec-add-expense">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Add Expense
        </button>
        <button className="ec-btn ec-settle-up" onClick={updateExpenseData}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Optional footer if used */}
      {/* <div className="ec-summary-footer">
        <div className="ec-summary-stats">
          <div className="ec-stat-item">
            <span className="ec-stat-label">items</span>
            <span className="ec-stat-value">12</span>
          </div>
          <span className="ec-stat-separator">•</span>
          <div className="ec-stat-item">
            <span className="ec-stat-label">avg</span>
            <span className="ec-stat-value">₹1,220</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ExpenseCard;
