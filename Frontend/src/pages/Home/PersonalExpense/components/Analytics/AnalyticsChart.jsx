import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import "./AnalyticsChart.css";

const AnalyticsChart = ({ expenses }) => {
  const [chartType, setChartType] = useState("category");

  // Aggregate data
  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      totals[cat] = (totals[cat] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  const dailyTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const date = e.date
        ? new Date(e.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      totals[date] = (totals[date] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  // Chart options
  const options = useMemo(() => {
    if (chartType === "category") {
      return {
        title: { text: "Expenses by Category", left: "center" },
        tooltip: { trigger: "item", formatter: "{b}: ₹{c} ({d}%)" },
        legend: { type: "scroll", orient: "vertical", left: "left" },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            data: Object.entries(categoryTotals).map(([name, value]) => ({
              name,
              value,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0,0,0,0.3)",
              },
            },
          },
        ],
        color: [
          "#4f46e5", "#f63beaff", "#0d9488", "#dc2626", "#d97706",
          "#03ff29ff", "#00eeffff", "#2563eb", "#ffcc00ff", "#f2ff03ff",
        ],
      };
    } else if (chartType === "trend") {
      const dates = Object.keys(dailyTotals).sort();
      const data = dates.map((d) => dailyTotals[d]);
      return {
        title: { text: "Spending Trend Over Time", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: dates, axisLabel: { rotate: 45 } },
        yAxis: { type: "value" },
        series: [{ data, type: "line", smooth: true, areaStyle: {}, color: "#326cffff" }],
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      };
    } else {
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // top 10
      const labels = sortedCategories.map(([cat]) => cat);
      const data = sortedCategories.map(([, amt]) => amt);
      return {
        title: { text: "Top Categories", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: labels, axisLabel: { rotate: 20, interval: 0 } },
        yAxis: { type: "value" },
        series: [{ data, type: "bar", barWidth: "50%", itemStyle: { color: "#326cffff" } }],
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      };
    }
  }, [chartType, categoryTotals, dailyTotals]);

  return (
    <div className="pe-analytics-container">
      <div className="pe-analytics-header">
        <h2 className="pe-analytics-title">Spending Analytics</h2>
        <div className="chart-buttons">
          {["category", "trend", "comparison"].map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`btn-toggle ${chartType === t ? "active" : ""}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="pe-chart-container">
        {/* Force re-render by using chartType as key */}
        <ReactECharts
          key={chartType}
          option={options}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default AnalyticsChart;
