import Chart from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";

import "./AnalyticsChart.css";

const AnalyticsChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartType, setChartType] = useState("category");

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    if (chartType === "category") {
      createCategoryChart(ctx);
    } else if (chartType === "trend") {
      createTrendChart(ctx);
    } else {
      createComparisonChart(ctx);
    }
  }, [expenses, chartType]);

  // 📊 Chart 1: Category Distribution (Doughnut)
  const createCategoryChart = (ctx) => {
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            data: Object.values(categoryTotals),
            backgroundColor: ["#8b5cf6", "#3b82f6", "#10b981", "#f43f5e"],
          },
        ],
      },
    });
  };

  // 📈 Chart 2: Trend over Time (Line chart)
  const createTrendChart = (ctx) => {
    const dailyTotals = {};
    expenses.forEach((e) => {
      const date = e.date || new Date(e.timestamp).toISOString().split("T")[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + e.amount;
    });

    const labels = Object.keys(dailyTotals).sort();
    const data = labels.map((date) => dailyTotals[date]);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Daily Spending",
            data,
            borderColor: "#8b5cf6",
            fill: false,
            tension: 0.3,
          },
        ],
      },
    });
  };

  // ⚖️ Chart 3: Comparison (Bar chart of top categories)
  const createComparisonChart = (ctx) => {
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5

    const labels = sortedCategories.map(([cat]) => cat);
    const data = sortedCategories.map(([, amt]) => amt);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Top Categories",
            data,
            backgroundColor: ["#8b5cf6", "#3b82f6", "#10b981", "#f43f5e", "#f59e0b"],
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

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
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="pe-chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default AnalyticsChart;
