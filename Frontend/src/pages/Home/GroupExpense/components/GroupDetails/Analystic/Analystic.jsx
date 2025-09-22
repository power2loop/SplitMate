import React from 'react';
import './Analystic.css';

const Analytics = () => {
  const stats = [
    { icon: '💰', label: 'Total Spent', value: 0 },
    { icon: '📘', label: 'Avg per Expense', value: 0 },
    { icon: '👥', label: 'Avg per Person', value: 0 },
    { icon: '🏨', label: 'Top Category', value: 0, sub: 'Accommodation' },
    { icon: '📅', label: 'Biggest Day', value: 0, sub: 'Jan 15, 2024' },
    { icon: '🧾', label: 'Total Expenses', raw: 0 },
  ];
0
  const categories = [
    { name: 'Accommodation', amount: 0, pct: 80.6, color: '#8B5CF6' },
    { name: 'Food & Dining', amount: 0, pct: 12.9, color: '#06B6D4' },
    { name: 'Transportation', amount: 0, pct: 6.5, color: '#10B981' },
  ];

  const payers = [
    { id: 'Y', name: 'You', amount: 0, pct: 80.6, color: '#F59E0B' },
    { id: 'JS', name: 'Jane Smith', amount: 0, pct: 12.9, color: '#22C55E' },
    { id: 'MJ', name: 'Mike Johnson', amount: 0, pct: 6.5, color: '#EF4444' },
  ];

  return (
    <div className="analytics-container">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-value">{typeof s.value === 'number' ? `₹${s.value.toLocaleString()}` : s.raw}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card left-card" id='Analytics'>
          <h3>Spending by Category</h3>
          <div className="left-content">
            <div className="pie">
              <svg viewBox="0 0 36 36" className="donut">
                <circle className="ring" cx="18" cy="18" r="15.915"></circle>
                <circle className="slice acc" cx="18" cy="18" r="15.915" strokeDasharray={`${categories[0].pct} ${100 - categories[0].pct}`} strokeDashoffset="25"></circle>
                <circle className="slice food" cx="18" cy="18" r="15.915" strokeDasharray={`${categories[1].pct} ${100 - categories[1].pct}`} strokeDashoffset={`${25 - categories[0].pct}`}></circle>
                <circle className="slice trans" cx="18" cy="18" r="15.915" strokeDasharray={`${categories[2].pct} ${100 - categories[2].pct}`} strokeDashoffset={`${25 - categories[0].pct - categories[1].pct}`}></circle>
              </svg>
            </div>
            <div className="legend">
              {categories.map((c, i) => (
                <div key={i} className="legend-row">
                  <span className="legend-dot" style={{ backgroundColor: c.color }} />
                  <span className="legend-name">{c.name}</span>
                  <span className="legend-amount">₹{c.amount.toLocaleString()}</span>
                  <span className="legend-pct">{0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card right-card">
          <h3>Who Paid What</h3>
          <div className="payers">
            {payers.map((p, i) => (
              <div key={i} className="payer-row">
                <div className="payer-id" style={{ backgroundColor: p.color }}>{p.id}</div>
                <div className="bar-wrap">
                  <div className="bar" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                </div>
                <div className="payer-amount">₹{p.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="timeline card">
        <h3>Daily Spending Timeline</h3>
        <div className="timeline-row">
          <span className="date">Jan 15</span>
          <div className="timeline-bar">
            <div className="fill pink" style={{ width: '100%' }} />
          </div>
          <span className="amt">₹0</span>
        </div>
        <div className="timeline-row">
          <span className="date">Jan 16</span>
          <div className="timeline-bar">
            <div className="fill teal" style={{ width: '35%' }} />
          </div>
          <span className="amt">₹0</span>
        </div>
        <div className="timeline-row">
          <span className="date">Jan 17</span>
          <div className="timeline-bar">
            <div className="fill green" style={{ width: '20%' }} />
          </div>
          <span className="amt">₹0</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;