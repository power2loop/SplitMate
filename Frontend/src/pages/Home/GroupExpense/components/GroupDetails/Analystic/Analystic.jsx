// Frontend/src/pages/Home/GroupExpense/components/GroupDetails/Analystic/Analystic.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Analystic.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { api } from "../../../../../../services/api.js";

const Analytics = ({ groupId }) => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [stats, setStats] = useState([]);
  const [payers, setPayers] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [nets, setNets] = useState({});
  const [membersMin, setMembersMin] = useState([]);

  // Optional UX: disable one row button during post
  const [postingId, setPostingId] = useState(null);

  async function fetchAnalytics() {
    const data = await api(`/groups/${encodeURIComponent(groupId)}/analytics`);
    setStats(data.stats || []);
    setPayers(data.payers || []);
    setTimelineData(data.timelineData || []);
    setHeatmapData(data.heatmapData || []);
    setSettlements(data.settlements || []);
    setNets(data.nets || {});
    setMembersMin(data.membersMin || []);
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchAnalytics();
        if (!alive) return;
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load analytics");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [groupId]); // memoized dependencies are separate from this effect

  // Record settlement and refetch
  async function settle(s) {
    try {
      const key = `${s.fromId}-${s.toId}-${s.amount}`;
      setPostingId(key);
      await api(`/groups/${encodeURIComponent(groupId)}/settlements`, {
        method: "POST",
        body: { fromId: s.fromId, toId: s.toId, amount: s.amount, note: "Settle via Analytics" },
      });
      await fetchAnalytics();
    } catch (e) {
      setErr(e.message || "Failed to settle");
    } finally {
      setPostingId(null);
    }
  }

  const insightMessage = useMemo(() => {
    if (!payers.length || !timelineData.length) return "No insights available.";
    const sortedPayers = [...payers].sort((a, b) => (b.pct || 0) - (a.pct || 0));
    const user = sortedPayers[0];
    const peak = timelineData.reduce((a, b) => (b.amount > a.amount ? b : a), timelineData[0]);
    const totalGroupSpent = payers.reduce((s, p) => s + (p.amount || 0), 0);
    if (user && user.pct >= 50) return `Top contributor: ${user.name} with ${user.pct}% share.`;
    if (peak && peak.amount > 0) return `Daily spend peaked on ${peak.date} with ₹${peak.amount}.`;
    if (totalGroupSpent > 10000) return `Total group spend ₹${totalGroupSpent}. Consider a budget this month.`;
    return "No insights available.";
  }, [payers, timelineData]); // derived text

  if (loading) return <div className="analytics-container">Loading…</div>;
  if (err) return <div className="analytics-container error">{err}</div>;

  const suggestions = settlements?.length ? settlements : [];

  const totalSuggestionAmount = suggestions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

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
              {typeof s.value === "number" ? `₹${Number(s.value).toLocaleString()}` : s.raw}
            </div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Who Paid What + Settlement */}
      <div className="row two-cards">
        {/* Who Paid What */}
        <div className="card left-card">
          <h3>
            Who Paid What <span className="sub-text">{payers.length} members</span>
          </h3>
          {payers.map((p, i) => (
            <div key={i} className="payer-row">
              <div className="payer-id" style={{ backgroundColor: p.color || "#8B5CF6" }}>
                {(p.id || p.name || "?").toString().slice(0, 2).toUpperCase()}
              </div>
              <div className="payer-details">
                <div className="payer-name">{p.name}</div>
                <div className="bar-wrap">
                  <div className="bar" style={{ width: `${p.pct || 0}%`, backgroundColor: p.color || "#8B5CF6" }} />
                </div>
                <div className="payer-balance">Contributed {p.pct || 0}%</div>
              </div>
              <div className="payer-amount">₹{(p.amount || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Settlement - Server suggestions (net-based) */}
        <div className="card right-card">
          <h3>
            ⚠ Settlement Required{" "}
            <span className="sub-text">
              ₹{Math.round(totalSuggestionAmount)} total
            </span>
          </h3>

          {suggestions.length === 0 && (
            <div className="muted">All settled up! 🎉</div>
          )}

          {suggestions.map((s, i) => {
            const key = `${s.fromId}-${s.toId}-${s.amount}`;
            const disabled = postingId === key;
            return (
              <div key={i} className="settle-row">
                <div className="settle-from">{s.fromName ?? s.from ?? s.fromId}</div>
                <span className="arrow">→</span>
                <div className="settle-to">{s.toName ?? s.to ?? s.toId}</div>
                <div className="settle-text">Owes ₹{Math.round(Number(s.amount) || 0)}</div>
                <div className="settle-amount">₹{Math.round(Number(s.amount) || 0)}</div>
                <button
                  className="settle-btn"
                  onClick={() => settle(s)}
                  disabled={disabled}
                  title={`${s.fromName ?? s.from ?? s.fromId} owes ${s.toName ?? s.to ?? s.toId} ₹${Math.round(Number(s.amount) || 0)}`}
                >
                  {disabled ? "Settling…" : "Settle"}
                </button>
              </div>
            );
          })}

          {/* Balance Breakdown from backend nets */}
          <div className="balance-breakdown">
            <h4>Balance Breakdown:</h4>
            {membersMin.map(m => {
              const bal = Math.round(Number(nets[m.id] || 0));
              return (
                <div key={m.id} className="balance-item">
                  <span className="balance-name">{m.name}</span>
                  <span className={`balance-amount ${bal >= 0 ? 'positive' : 'negative'}`}>
                    {bal >= 0 ? '+' : ''}₹{bal}
                  </span>
                  <span className="balance-status">
                    {bal > 0 ? 'is owed' : bal < 0 ? 'owes' : 'settled'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <div className="card insights-card">
        <h3>Smart Insights (AI/Rule-based)</h3>
        <div>{insightMessage}</div>
      </div>

      {/* Pie Chart + Heatmap */}
      <div className="card split-heatmap">
        <div className="split-box">
          <h3>Expense Split by % per Person</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={payers} cx="50%" cy="50%" outerRadius={100} dataKey="amount" label>
                {payers.map((p, index) => (
                  <Cell key={`cell-${index}`} fill={p.color || "#8B5CF6"} />
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
              <div key={idx} className="heatmap-cell" style={{ background: d.color || "#93C5FD" }}>
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
