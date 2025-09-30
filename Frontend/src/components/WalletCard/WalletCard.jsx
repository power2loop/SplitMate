import React, { useEffect, useState } from "react";

import "./WalletCard.css";

const WalletCard = () => {
  const [walletData, setWalletData] = useState({
    totalSpent: 57850,
    totalSpentChange: 18.2,
    youOwe: 19440,
    youOweChange: -5.7,
    lastUpdated: new Date(),
  });

  const [settleStatus, setSettleStatus] = useState(null); // null | "settling" | "done"

  const updateWalletData = () => {
    setWalletData({
      totalSpent: Math.floor(Math.random() * 80000) + 20000,
      totalSpentChange: +(Math.random() * 40 - 20).toFixed(1),
      youOwe: Math.floor(Math.random() * 10000) + 500,
      youOweChange: +(Math.random() * 20 - 10).toFixed(1),
      lastUpdated: new Date(),
    });
  };

  useEffect(() => {
    const interval = setInterval(updateWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
  const formatPercentage = (change) => `${change >= 0 ? "+" : ""}${change}%`;

  const handleSettleUp = () => {
    setSettleStatus("settling");
    setTimeout(() => setSettleStatus("done"), 1000);
    setTimeout(() => setSettleStatus(null), 2000);
  };

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
          <h3 className="ec-title">Wallet Summary</h3>
        </div>
        <div className="ec-balance-indicator">
          <div className="ec-balance-dot"></div>
          <span className="ec-balance-text">Updated</span>
        </div>
      </div>

      <div className="ec-metrics">
        <div className="ec-metric-card">
          <div className="ec-metric-label">Total Spent</div>
          <div className="ec-metric-value">{formatCurrency(walletData.totalSpent)}</div>
          <div
            className={`ec-metric-change ${walletData.totalSpentChange >= 0 ? "ec-increase" : "ec-decrease"}`}
          >
            {formatPercentage(walletData.totalSpentChange)}
          </div>
        </div>
        <div className="ec-metric-card">
          <div className="ec-metric-label">You Owe</div>
          <div className="ec-metric-value">{formatCurrency(walletData.youOwe)}</div>
          <div
            className={`ec-metric-change ${walletData.youOweChange >= 0 ? "ec-increase" : "ec-decrease"}`}
          >
            {formatPercentage(walletData.youOweChange)}
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
        <button className="ec-btn ec-settle-up" onClick={handleSettleUp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23" />
          </svg>
          Settle Up
        </button>
      </div>

      {settleStatus && (
        <div
          className={`ec-settle-popup ${settleStatus === "settling" ? "ec-settling" : "ec-done"}`}
        >
          {settleStatus === "settling" ? "Settling..." : "Done!"}
        </div>
      )}
    </div>
  );
};

export default WalletCard;
