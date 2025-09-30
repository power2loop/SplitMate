import { Calendar, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import "./Chart.css";

const generateRandomData = (baseValue = 65) => {
  return [
    { date: "Apr 2", value: Math.floor(Math.random() * 40) + baseValue - 20 },
    { date: "Apr 7", value: Math.floor(Math.random() * 40) + baseValue - 15 },
    { date: "Apr 12", value: Math.floor(Math.random() * 40) + baseValue - 10 },
    { date: "Apr 17", value: Math.floor(Math.random() * 40) + baseValue - 5 },
    { date: "Apr 22", value: Math.floor(Math.random() * 40) + baseValue },
    { date: "Apr 27", value: Math.floor(Math.random() * 40) + baseValue + 5 },
    { date: "May 2", value: Math.floor(Math.random() * 40) + baseValue + 10 },
    { date: "May 7", value: Math.floor(Math.random() * 40) + baseValue + 5 },
    { date: "May 12", value: Math.floor(Math.random() * 40) + baseValue },
    { date: "May 17", value: Math.floor(Math.random() * 40) + baseValue + 15 },
    { date: "May 23", value: Math.floor(Math.random() * 40) + baseValue + 8 },
    { date: "May 29", value: Math.floor(Math.random() * 40) + baseValue + 12 },
    { date: "Jun 3", value: Math.floor(Math.random() * 40) + baseValue + 6 },
    { date: "Jun 8", value: Math.floor(Math.random() * 40) + baseValue + 18 },
    { date: "Jun 13", value: Math.floor(Math.random() * 40) + baseValue + 22 },
    { date: "Jun 18", value: Math.floor(Math.random() * 40) + baseValue + 16 },
    { date: "Jun 23", value: Math.floor(Math.random() * 40) + baseValue + 25 },
    { date: "Jun 30", value: Math.floor(Math.random() * 40) + baseValue + 20 },
  ];
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          Value: <span className="tooltip-number">{payload.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DateSelector = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const handleApply = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onDateChange(newDate);
    setIsOpen(false);
  };

  const formatSelectedDate = () => {
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  return (
    <div className="date-selector-container">
      <button className="date-selector-button" onClick={() => setIsOpen(!isOpen)}>
        <Calendar className="date-selector-icon" size={16} />
        <span className="date-selector-text">{formatSelectedDate()}</span>
        <ChevronDown className="date-selector-chevron" size={16} />
      </button>

      {isOpen && (
        <div className="date-selector-dropdown">
          <div className="date-selector-header">
            <h4>Select Period</h4>
          </div>
          <div className="date-selector-content">
            <div className="date-selector-section">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="date-selector-select"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="date-selector-section">
              <label>Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="date-selector-select"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="date-selector-actions">
            <button className="date-selector-cancel" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button className="date-selector-apply" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Chart = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(generateRandomData());

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimationStep(1), 600);
    const timer3 = setTimeout(() => setAnimationStep(2), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Generate new random data when date changes
    const baseValue = 45 + Math.floor(Math.random() * 40);
    setChartData(generateRandomData(baseValue));
  };

  return (
    <div className={`chart-container ${isVisible ? "visible" : ""}`}>
      <div className="chart-header">
        <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />
      </div>

      <div className={`chart-wrapper ${animationStep >= 2 ? "chart-animate" : ""}`}>
        <div className="chart-glow"></div>
        <ResponsiveContainer width="100%" height={333}>
          <RechartsAreaChart
            data={chartData}
            margin={{
              top: 70,
              right: 40,
              left: 40,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="sophisticatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E6F0FF" stopOpacity={0.95} />
                <stop offset="35%" stopColor="#6DA3F5" stopOpacity={0.8} />
                <stop offset="65%" stopColor="#3678F0" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#0A1E40" stopOpacity={0.45} />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="8"
                  floodColor="#0EA5E9"
                  floodOpacity="0.3"
                />
              </filter>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#5e5e5eff",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "poppins",
              }}
              interval={0}
              className="axis-text"
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine y={65} stroke="#3678f0" strokeDasharray="2 2" strokeOpacity={0.5} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={3}
              fill="url(#sophisticatedGradient)"
              fillOpacity={1}
              filter="url(#shadow)"
              className="area-path"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
