import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import { api } from "../../services/api";
import "./Chart.css";

const ComboChart = () => {
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const containerRef = useRef(null);

  const [walletData, setWalletData] = useState({
    totalSpent: 0,
    totalInvestment: 0,
  });

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const data = await api("users/wallet");
      setWalletData({
        totalSpent: data.totalSpent || 0,
        totalInvestment: data.totalInvestment || 0,
      });
    } catch (err) {
      console.error("Error fetching wallet data:", err.message);
    }
  };

  useEffect(() => {
    fetchWalletData();
    const interval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  const pieOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ₹{c} ({d}%)",
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: { fontFamily: "Poppins", color: "#111827" },
      extraCssText:
        "box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; padding: 12px 16px;",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: { fontFamily: "Poppins", color: "#374151", fontWeight: 500 },
    },
    series: [
      {
        name: "Wallet Summary",
        type: "pie",
        radius: ["45%", "70%"], // donut style
        center: ["50%", "50%"],
        data: [
          { value: walletData.totalSpent, name: "Personal Expense" },
          { value: walletData.totalInvestment, name: "Investment" },
        ],
        color: [
          {
            type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: "#fca5a5" },
              { offset: 1, color: "#f87171" },
            ]
          },
          {
            type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: "#93c5fd" },
              { offset: 1, color: "#3b82f6" },
            ]
          },
        ],
        label: {
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "#111827",
          formatter: "{b}\n₹{c} ({d}%)",
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          shadowBlur: 20,
          shadowColor: "rgba(0,0,0,0.3)",
        },
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
      },
    ],
  };

  const barOption = {
    title: {
      text: "Wallet Summary",
      left: "center",
      textStyle: {
        fontFamily: "Poppins",
        fontSize: 16,
        fontWeight: 600,
        color: "#111827",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      textStyle: { color: "#111827", fontFamily: "Poppins" },
      extraCssText:
        "box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; padding: 12px 16px;",
      formatter: (params) =>
        params
          .map(
            (p) =>
              `<div style="color:${p.color}; font-weight:500;">
                 ${p.seriesName}: ₹${p.value.toLocaleString("en-IN")}
               </div>`
          )
          .join(""),
    },
    xAxis: {
      type: "category",
      data: ["Wallet"],
      axisLine: { lineStyle: { color: "#E5E7EB" } },
      axisLabel: { color: "#6b7280", fontFamily: "Poppins", fontWeight: 500 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f3f4f6" } },
      axisLabel: { color: "#6b7280", fontFamily: "Poppins" },
    },
    series: [
      {
        name: "Personal Expense",
        type: "bar",
        data: [walletData.totalSpent],
        barWidth: "40%",
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#f87171" },
              { offset: 1, color: "#fca5a5" },
            ],
          },
        },
        emphasis: { focus: "series", scale: true },
      },
      {
        name: "Investment",
        type: "bar",
        data: [walletData.totalInvestment],
        barWidth: "40%",
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#60a5fa" },
              { offset: 1, color: "#3b82f6" },
            ],
          },
        },
        emphasis: { focus: "series", scale: true },
      },
    ],
    grid: { left: "8%", right: "8%", bottom: "12%", top: "20%", containLabel: true },
    animationDuration: 1200,
    animationEasing: "cubicOut",
  };

  // Responsive
  useEffect(() => {
    const pieChart = pieRef.current?.getEchartsInstance();
    const barChart = barRef.current?.getEchartsInstance();
    const observer = new ResizeObserver(() => {
      pieChart?.resize();
      barChart?.resize();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="chart-container visible" ref={containerRef}>
      <div className="chart-flex">
        <div className="chart-item">
          <ReactECharts
            ref={pieRef}
            option={pieOption}
            style={{ width: "100%", height: "100%" }} // fill parent
          />
        </div>

        <div className="chart-item">
          <ReactECharts
            ref={barRef}
            option={barOption}
            style={{ width: "100%", height: "100%" }} // fill parent
          />
        </div>
      </div>
    </div>
  );
};

export default ComboChart;
