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

  const options = useMemo(() => {
    if (chartType === "category") {
      return {
        title: {
          text: "Expenses by Category",
          left: "center",
          top: 10,
          textStyle: {
            fontSize: window.innerWidth < 768 ? 14 : 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: ₹{c} ({d}%)",
          textStyle: {
            fontSize: window.innerWidth < 768 ? 12 : 14
          }
        },
        legend: {
          orient: window.innerWidth < 768 ? "horizontal" : "vertical",
          left: window.innerWidth < 768 ? "center" : "left",
          top: window.innerWidth < 768 ? "bottom" : "middle",
          bottom: window.innerWidth < 768 ? 10 : "auto",
          itemWidth: window.innerWidth < 768 ? 12 : 25,
          itemHeight: window.innerWidth < 768 ? 12 : 14,
          textStyle: {
            fontSize: window.innerWidth < 768 ? 10 : 12
          },
          padding: window.innerWidth < 768 ? [5, 0] : [0, 0]
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        series: [
          {
            type: "pie",
            radius: window.innerWidth < 768
              ? ["30%", "60%"]
              : window.innerWidth < 480
                ? ["25%", "55%"]
                : ["40%", "70%"],
            center: window.innerWidth < 768
              ? ["50%", "45%"]
              : ["60%", "50%"],
            label: {
              show: window.innerWidth >= 768,
              formatter: "{b}: {d}%",
              fontSize: window.innerWidth < 768 ? 10 : 12
            },
            labelLine: {
              show: window.innerWidth >= 768
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: Object.entries(categoryTotals).map(([name, value]) => ({
              name,
              value,
            })),
          },
        ],
      };
    } else if (chartType === "trend") {
      const dates = Object.keys(dailyTotals).sort();
      const data = dates.map((d) => dailyTotals[d]);
      return {
        title: {
          text: "Spending Trend Over Time",
          left: "center",
          textStyle: {
            fontSize: window.innerWidth < 768 ? 14 : 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: window.innerWidth < 768 ? 12 : 14
          }
        },
        grid: {
          left: window.innerWidth < 768 ? "15%" : "10%",
          right: window.innerWidth < 768 ? "15%" : "10%",
          top: window.innerWidth < 768 ? "20%" : "15%",
          bottom: window.innerWidth < 768 ? "25%" : "15%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            rotate: window.innerWidth < 768 ? 45 : 30,
            fontSize: window.innerWidth < 768 ? 10 : 12
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            fontSize: window.innerWidth < 768 ? 10 : 12
          }
        },
        legend: { show: false },
        series: [
          {
            data,
            type: "line",
            smooth: true,
            areaStyle: {},
            color: "#4f46e5",
            lineStyle: {
              width: window.innerWidth < 768 ? 2 : 3
            }
          },
        ],
      };
    } else {
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      const labels = sortedCategories.map(([cat]) => cat);
      const data = sortedCategories.map(([, amt]) => amt);
      return {
        title: {
          text: "Top Categories",
          left: "center",
          textStyle: {
            fontSize: window.innerWidth < 768 ? 14 : 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: window.innerWidth < 768 ? 12 : 14
          }
        },
        grid: {
          left: window.innerWidth < 768 ? "15%" : "10%",
          right: window.innerWidth < 768 ? "15%" : "10%",
          top: window.innerWidth < 768 ? "20%" : "15%",
          bottom: window.innerWidth < 768 ? "25%" : "15%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: {
            rotate: window.innerWidth < 768 ? 30 : 20,
            fontSize: window.innerWidth < 768 ? 10 : 12
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            fontSize: window.innerWidth < 768 ? 10 : 12
          }
        },
        legend: { show: false },
        series: [
          {
            data,
            type: "bar",
            barWidth: window.innerWidth < 768 ? "40%" : "50%",
            itemStyle: { color: "#4f46e5" },
          },
        ],
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
        <ReactECharts
          key={chartType}
          option={options}
          style={{ height: "100%", width: "100%" }}
          opts={{
            renderer: "canvas",
            width: 'auto',
            height: 'auto'
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsChart;
