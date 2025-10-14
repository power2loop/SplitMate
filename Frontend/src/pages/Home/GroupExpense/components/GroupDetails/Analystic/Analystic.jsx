// Frontend/src/pages/Home/GroupExpense/components/GroupDetails/Analystic/Analystic.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Analystic.css";

import { IoMdBookmarks } from "react-icons/io";
import ReactECharts from "echarts-for-react";

import Loader from "../../../../../../components/Loader/Loader.jsx";
import { api } from "../../../../../../services/api.js";

// Direct confetti import to trigger programmatically
import confetti from "canvas-confetti";

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
        if (alive) setTimeout(() => setLoading(false), 500);
      }
    })();
    return () => {
      alive = false;
    };
  }, [groupId]);

  // Fireworks helper
  function triggerFireworks() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  // Record settlement and refetch
  async function settle(s) {
    try {
      const key = `${s.fromId}-${s.toId}-${s.amount}`;
      setPostingId(key);
      await api(`/groups/${encodeURIComponent(groupId)}/settlements`, {
        method: "POST",
        body: {
          fromId: s.fromId,
          toId: s.toId,
          amount: s.amount,
          note: "Settle via Analytics",
        },
      });

      triggerFireworks();
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
    const peak = timelineData.reduce(
      (a, b) => (b.amount > a.amount ? b : a),
      timelineData[0]
    );
    const totalGroupSpent = payers.reduce((s, p) => s + (p.amount || 0), 0);
    if (user && user.pct >= 50)
      return `Top contributor: ${user.name} with ${user.pct}% share.`;
    if (peak && peak.amount > 0)
      return `Daily spend peaked on ${peak.date} with ₹${peak.amount}.`;
    if (totalGroupSpent > 10000)
      return `Total group spend ₹${totalGroupSpent}. Consider a budget this month.`;
    return "No insights available.";
  }, [payers, timelineData]);

  if (loading)
    return (
      <div className="analytics-container">
        <Loader />
      </div>
    );
  if (err) return <div className="analytics-container error">{err}</div>;

  const suggestions = settlements?.length ? settlements : [];
  const totalSuggestionAmount = suggestions.reduce(
    (sum, s) => sum + (Number(s.amount) || 0),
    0
  );

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
              {typeof s.value === "number"
                ? `₹${Number(s.value).toLocaleString()}`
                : s.raw}
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
              <div
                className="payer-id"
                style={{ backgroundColor: p.color || "#8B5CF6" }}
              >
                {(p.id || p.name || "?").toString().slice(0, 2).toUpperCase()}
              </div>
              <div className="payer-details">
                <div className="payer-name">{p.name}</div>
                <div className="bar-wrap">
                  <div
                    className="bar"
                    style={{
                      width: `${p.pct || 0}%`,
                      backgroundColor: p.color || "#8B5CF6",
                    }}
                  />
                </div>
                <div className="payer-balance">Contributed {p.pct || 0}%</div>
              </div>
              <div className="payer-amount">
                ₹{(p.amount || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Settlement */}
        <div className="card right-card">
          <h3
            style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <IoMdBookmarks />
            Settlement Required{" "}
            <span className="sub-text">
              ₹{Math.round(totalSuggestionAmount)} total
            </span>
          </h3>

          {suggestions.length === 0 && <div className="muted">All settled up! 🎉</div>}

          {suggestions.map((s, i) => {
            const key = `${s.fromId}-${s.toId}-${s.amount}`;
            const disabled = postingId === key;
            return (
              <div key={i} className="settle-row" id="settle-row">
                <div className="settle-from">
                  {s.fromName ?? s.from ?? s.fromId}
                </div>
                <span className="arrow">→</span>
                <div className="settle-to">
                  {s.toName ?? s.to ?? s.toId}
                </div>
                <div className="settle-amount">
                  ₹{Math.round(Number(s.amount) || 0)}
                </div>

                <button
                  className="settle-btn"
                  onClick={() => settle(s)}
                  disabled={disabled}
                  title={`${s.fromName ?? s.from ?? s.fromId
                    } owes ${s.toName ?? s.to ?? s.toId
                    } ₹${Math.round(Number(s.amount) || 0)}`}
                >
                  {disabled ? "Settling…" : "Settle"}
                </button>
              </div>
            );
          })}

          {/* Balance Breakdown */}
          <div className="balance-breakdown">
            <h4>Balance Breakdown:</h4>
            {membersMin.map((m) => {
              const bal = Math.round(Number(nets[m.id] || 0));
              return (
                <div key={m.id} className="balance-item">
                  <span className="balance-name">{m.name}</span>
                  <span
                    className={`balance-amount ${bal >= 0 ? "positive" : "negative"}`}
                  >
                    {bal >= 0 ? "+" : ""}₹{bal}
                  </span>
                  <span className="balance-status">
                    {bal > 0 ? "is owed" : bal < 0 ? "owes" : "settled"}
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
          <ReactECharts
            style={{ height: 300, width: "100%" }}
            option={{
              tooltip: { trigger: "item" },
              legend: { bottom: 0 },
              series: [
                {
                  name: "Expense Split",
                  type: "pie",
                  radius: "50%",
                  data: payers.map((p) => ({
                    value: p.amount,
                    name: p.name,
                    itemStyle: { color: p.color || "#8B5CF6" },
                  })),
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0,0,0,0.5)",
                    },
                  },
                  label: { formatter: "{b}: {d}%" },
                },
              ],
            }}
          />
        </div>
        <div className="split-box">
          <h3>Heatmap Calendar (Daily Spend Intensity)</h3>
          <div className="heatmap-grid">
            {heatmapData.map((d, idx) => (
              <div
                key={idx}
                className="heatmap-cell"
                style={{ background: d.color || "#93C5FD" }}
              >
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
        <ReactECharts
          style={{ height: 300, width: "100%" }}
          option={{
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: timelineData.map((d) => d.date) },
            yAxis: { type: "value" },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            series: [
              {
                data: timelineData.map((d) => d.amount),
                type: "bar",
                itemStyle: { color: "#3B82F6" },
                barBorderRadius: [6, 6, 0, 0],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
