import React from "react";
import "./card.css";

const Card = () => {
  return (
    <div className="expense-summary-card">
      <div className="expense-header">
        <div className="header-left">
          <div className="icon-container">
            <svg className="expense-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1v6m0 0l4-4m-4 4L8 3"/>
              <path d="M12 23v-6m0 0l4 4m-4-4l-4 4"/>
              <rect x="4" y="7" width="16" height="10" rx="2"/>
              <path d="M8 11h8"/>
            </svg>
          </div>
          <h3 className="expense-title">Expense Summary</h3>
        </div>
        <div className="balance-indicator">
          <div className="balance-dot"></div>
          <span className="balance-text">Updated</span>
        </div>
      </div>

      <div className="expense-metrics">
        <div className="expense-metric-card">
          <div className="metric-label">Total Spent</div>
          <div className="metric-value">₹12,450</div>
          <div className="metric-change increase">+18.2%</div>
        </div>
        <div className="expense-metric-card">
          <div className="metric-label">You Owe</div>
          <div className="metric-value">₹2,340</div>
          <div className="metric-change decrease">-5.7%</div>
        </div>
      </div>

      <div className="quick-actions-section">
        <button className="expense-action-btn add-expense">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Add Expense
        </button>
        <button className="expense-action-btn settle-up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23"/>
          </svg>
          Settle Up
        </button>
      </div>
    </div>
  );
};

export default Card;
