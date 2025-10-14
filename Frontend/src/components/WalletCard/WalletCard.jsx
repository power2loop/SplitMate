// src/components/WalletCard/WalletCard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../services/api"; // adjust path if needed
import "./WalletCard.css";

const WalletCard = () => {
  const [walletData, setWalletData] = useState({
    totalSpent: 0,
    totalInvestment: 0,
    youOwe: 0,
    lastUpdated: new Date(),
    totalSpentChange: 0,
    youOweChange: 0,
    totalInvestmentChange: 0,
  });

  const [settleStatus, setSettleStatus] = useState(null); // null | "settling" | "done"

  // Keep previous values for calculating change
  const [prevData, setPrevData] = useState({ totalSpent: 0, youOwe: 0, totalInvestment: 0 });

  const fetchWalletData = async () => {
    try {
      const data = await api("users/wallet"); // GET /wallet from backend
      const newTotalSpent = data.totalSpent || 0;
      const newYouOwe = data.totalOwePending || 0;
      const newInvestment = data.totalInvestment || 0;

      setWalletData({
        totalSpent: newTotalSpent,
        totalSpentChange: prevData.totalSpent
          ? +(((newTotalSpent - prevData.totalSpent) / prevData.totalSpent) * 100).toFixed(1)
          : 0,
        youOwe: newYouOwe,
        youOweChange: prevData.youOwe
          ? +(((newYouOwe - prevData.youOwe) / prevData.youOwe) * 100).toFixed(1)
          : 0,
        totalInvestment: newInvestment,
        totalInvestmentChange: prevData.totalInvestment
          ? +(((newInvestment - prevData.totalInvestment) / prevData.totalInvestment) * 100).toFixed(1)
          : 0,
        lastUpdated: new Date(data.lastUpdated),
      });

      setPrevData({
        totalSpent: newTotalSpent,
        youOwe: newYouOwe,
        totalInvestment: newInvestment,
      });
    } catch (err) {
      console.error("Error fetching wallet data:", err.message);
    }
  };

  useEffect(() => {
    fetchWalletData(); // initial fetch
    const interval = setInterval(fetchWalletData, 30000); // refresh every 30s
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
          <h3 className="ec-title">Amount Summary</h3>
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
            className={`ec-metric-change ${walletData.totalSpentChange >= 0 ? "ec-increase" : "ec-decrease"
              }`}
          >
            {formatPercentage(walletData.totalSpentChange)}
          </div>
        </div>
        {/* <div className="ec-metric-card">
          <div className="ec-metric-label">You Owe</div>
          <div className="ec-metric-value">{formatCurrency(walletData.youOwe)}</div>
          <div
            className={`ec-metric-change ${walletData.youOweChange >= 0 ? "ec-increase" : "ec-decrease"}`}
          >
            {formatPercentage(walletData.youOweChange)}
          </div>
        </div> */}
        <div className="ec-metric-card">
          <div className="ec-metric-label">Your Investment</div>
          <div className="ec-metric-value">{formatCurrency(walletData.totalInvestment)}</div>
          <div
            className={`ec-metric-change ${walletData.totalInvestmentChange >= 0 ? "ec-increase" : "ec-decrease"
              }`}
          >
            {formatPercentage(walletData.totalInvestmentChange)}
          </div>
        </div>
      </div>

      <div className="ec-actions">
        <button className="ec-btn ec-add-expense">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          <a href="/personalexpense">Add Expense</a>
        </button>
        <button className="ec-btn ec-settle-up" onClick={handleSettleUp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.23" />
          </svg>
          <a href="/groupexpense">Group Details</a>
        </button>
      </div>

      {/* {settleStatus && (
        <div
          className={`ec-settle-popup ${settleStatus === "settling" ? "ec-settling" : "ec-done"}`}
        >
          {settleStatus === "settling" ? "Settling..." : "Done!"}
        </div>
      )} */}
    </div>
  );
};

export default WalletCard;
