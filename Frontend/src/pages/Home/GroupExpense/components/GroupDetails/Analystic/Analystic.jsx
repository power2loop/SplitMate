import React from "react";
import "./Analystic.css";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const Analytics = () => {
  // --- Stats ---
  const stats = [
    { icon: "💰", label: "My Expenses", value: 2500 },
    { icon: "📘", label: "Avg per Expense", value: 800 },
    { icon: "👥", label: "Avg per Person", value: 1200 },
    { icon: "📅", label: "Biggest Day", value: 1600, sub: "Jan 18, 2024" },
    { icon: "🧾", label: "Total Expenses", raw: 5 }
  ];

  // --- Payers ---
  const payers = [
    { id: "Y", name: "You", amount: 2500, pct: 50, color: "#3B82F6" },
    { id: "JS", name: "John Smith", amount: 1800, pct: 36, color: "#F97316" },
    { id: "MJ", name: "Maria Johnson", amount: 700, pct: 14, color: "#8B5CF6" }
  ];

  // --- Timeline Data ---
  const timelineData = [
    { date: "Jan 15", amount: 800 },
    { date: "Jan 16", amount: 1200 },
    { date: "Jan 17", amount: 600 },
    { date: "Jan 18", amount: 1600 },
    { date: "Jan 19", amount: 900 }
  ];

  // --- Heatmap Data ---
  const heatmapData = [
    { day: "Jan 15", amount: 800, color: "#93C5FD" },
    { day: "Jan 16", amount: 1200, color: "#3B82F6" },
    { day: "Jan 17", amount: 600, color: "#93C5FD" },
    { day: "Jan 18", amount: 1600, color: "#2563EB" },
    { day: "Jan 19", amount: 900, color: "#60A5FA" }
  ];

  // --- Settlements ---
  const settlements = [
    { from: "JS", to: "Y", name: "John Smith", amount: 200 },
    { from: "MJ", to: "Y", name: "Maria Johnson", amount: 300 }
  ];

  // --- Calculations for Dynamic Insights ---
  const sortedPayers = [...payers].sort((a, b) => b.pct - a.pct);
  const userHighestShare = sortedPayers[0].id === "Y";
  const userShare = payers.find(p => p.id === "Y")?.pct || 0;
  const secondHighestUser = sortedPayers[1]?.name;
  const secondHighestShare = sortedPayers[1]?.pct;
  const peakDayData = timelineData.reduce((a, b) => (b.amount > a.amount ? b : a), timelineData[0]);
  const peakDay = peakDayData.date;
  const peakDayAmount = peakDayData.amount;
  const totalGroupSpent = payers.reduce((sum, p) => sum + p.amount, 0);
  const averageDailySpend = Math.round(totalGroupSpent / timelineData.length);
  const topCategory = "Misc"; // Placeholder if you have categories
  const topCategoryShare = 45; // Placeholder percentage
  const multipleHighSpenders = payers.filter(p => p.pct > 30).map(p => p.name);

  // --- Dynamic Insights ---
  const insights = [
    {
      condition: userHighestShare === true,
      message: `You contributed the highest share of expenses (${userShare}%).`
    },
    {
      condition: secondHighestUser && secondHighestShare > 0,
      message: `${secondHighestUser} has the second highest share (${secondHighestShare}%).`
    },
    {
      condition: peakDayAmount > 0,
      message: `Daily spend peaked on ${peakDay} with ₹${peakDayAmount}.`
    },
    {
      condition: totalGroupSpent > 10000,
      message: `The group spent a total of ₹${totalGroupSpent} this month. Consider budgeting to control group expenses.`
    },
    {
      condition: userShare > 50,
      message: `You're responsible for more than half of the group's expenses. Discuss cost-sharing with other members.`
    },
    {
      condition: multipleHighSpenders.length > 1,
      message: `Several members contributed significantly: ${multipleHighSpenders.join(", ")}.`
    },
    {
      condition: averageDailySpend > 1000,
      message: `Group's average daily spend is high (₹${averageDailySpend}). Consider reducing non-essential group expenses.`
    },
    {
      condition: topCategoryShare > 40,
      message: `The top expense category (${topCategory}) represents ${topCategoryShare}% of total group spending.`
    }
  ];

  return (
    <div className="analytics-container">
      {/* Top Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-value">
              {typeof s.value === "number" ? `₹${s.value.toLocaleString()}` : s.raw}
            </div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Who Paid What + Settlement Row */}
      <div className="row two-cards">
        {/* Who Paid What */}
        <div className="card left-card">
          <h3>
            Who Paid What <span className="sub-text">{payers.length} members</span>
          </h3>
          {payers.map((p, i) => (
            <div key={i} className="payer-row">
              <div className="payer-id" style={{ backgroundColor: p.color }}>
                {p.id}
              </div>
              <div className="payer-details">
                <div className="payer-name">{p.name}</div>
                <div className="bar-wrap">
                  <div
                    className="bar"
                    style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <div className="payer-balance">Contributed {p.pct}%</div>
              </div>
              <div className="payer-amount">₹{p.amount}</div>
            </div>
          ))}
        </div>

        {/* Settlement */}
        <div className="card right-card">
          <h3>
            ⚠ Settlement Required{" "}
            <span className="sub-text">
              ₹{settlements.reduce((sum, s) => sum + s.amount, 0)} total
            </span>
          </h3>
          {settlements.map((s, i) => (
            <div key={i} className="settle-row">
              <div className="settle-from">{s.from}</div>
              <span className="arrow">→</span>
              <div className="settle-to">{s.to}</div>
              <div className="settle-text">{s.name} owes You</div>
              <div className="settle-amount">₹{s.amount}</div>
              <button className="settle-btn">Settle</button>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="card insights-card">
        <h3>Smart Insights (AI/Rule-based)</h3>
        <div>
          {(() => {
            // Pick the first insight whose condition is true
            const firstTrueInsight = insights.find(insight => insight.condition);
            return firstTrueInsight ? firstTrueInsight.message : "No insights available.";
          })()}
        </div>
      </div>


      {/* Pie Chart + Heatmap Side by Side */}
      <div className="card split-heatmap">
        <div className="split-box">
          <h3>Expense Split by % per Person</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={payers} cx="50%" cy="50%" outerRadius={100} dataKey="amount" label>
                {payers.map((p, index) => (
                  <Cell key={`cell-${index}`} fill={p.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="split-box">
          <h3>Heatmap Calendar (Daily Spend Intensity)</h3>
          <div className="heatmap-grid">
            {heatmapData.map((d, idx) => (
              <div key={idx} className="heatmap-cell" style={{ background: d.color }}>
                <div className="heatmap-day">{d.day}</div>
                <div className="heatmap-amt">₹{d.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Spending Timeline */}
      <div className="card timeline-chart">
        <h3>Daily Spending Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
