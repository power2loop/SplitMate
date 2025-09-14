import React, { useState, useEffect } from "react";
import "./WalletCard.css";

const WalletCard = () => {
  const [walletData, setWalletData] = useState({
    totalSpent: 57850,
    totalSpentChange: 18.2,
    youOwe: 19440,
    youOweChange: -5.7,
    lastUpdated: new Date()
  });

  // 👇 state for popup
  const [settleStatus, setSettleStatus] = useState(null); // null | "settling" | "done"

  const updateWalletData = () => {
    setWalletData({
      totalSpent: Math.floor(Math.random() * 80000) + 20000,
      totalSpentChange: (Math.random() * 40 - 20).toFixed(1),
      youOwe: Math.floor(Math.random() * 10000) + 500,
      youOweChange: (Math.random() * 20 - 10).toFixed(1),
      lastUpdated: new Date()
    });
  };

  useEffect(() => {
    const interval = setInterval(updateWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
  const formatPercentage = (change) =>
    `${change >= 0 ? "+" : ""}${change}%`;

  // 👇 handle settle click
  const handleSettleUp = () => {
    setSettleStatus("settling");
    setTimeout(() => setSettleStatus("done"), 1000); // show “settling” for 1s
    setTimeout(() => setSettleStatus(null), 2000);   // hide popup after total 2s
  };

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
          <h3 className="expense-title">Wallet Summary</h3>
        </div>
        <div className="balance-indicator">
          <div className="balance-dot"></div>
          <span className="balance-text">Updated</span>
        </div>
      </div>

      <div className="expense-metrics">
        <div className="expense-metric-card">
          <div className="metric-label">Total Spent</div>
          <div className="metric-value">{formatCurrency(walletData.totalSpent)}</div>
          <div
            className={`metric-change ${
              walletData.totalSpentChange >= 0 ? "increase" : "decrease"
            }`}
          >
            {formatPercentage(walletData.totalSpentChange)}
          </div>
        </div>
        <div className="expense-metric-card">
          <div className="metric-label">You Owe</div>
          <div className="metric-value">{formatCurrency(walletData.youOwe)}</div>
          <div
            className={`metric-change ${
              walletData.youOweChange >= 0 ? "increase" : "decrease"
            }`}
          >
            {formatPercentage(walletData.youOweChange)}
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
          onClick={handleSettleUp}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23" />
          </svg>
          Settle Up
        </button>
      </div>

      {/* ✅ Popup overlay */}
      {settleStatus && (
        <div className="settle-popup">
          {settleStatus === "settling" ? "Settling..." : "Done!"}
        </div>
      )}
    </div>
  );
};

export default WalletCard;
