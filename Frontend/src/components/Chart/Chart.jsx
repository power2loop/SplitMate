import React, { useState, useEffect } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import "./Chart.css";

const data = [
  { date: "Apr 2", value: 45 },
  { date: "Apr 7", value: 52 },
  { date: "Apr 12", value: 48 },
  { date: "Apr 17", value: 61 },
  { date: "Apr 22", value: 55 },
  { date: "Apr 27", value: 67 },
  { date: "May 2", value: 71 },
  { date: "May 7", value: 64 },
  { date: "May 12", value: 59 },
  { date: "May 17", value: 76 },
  { date: "May 23", value: 69 },
  { date: "May 29", value: 73 },
  { date: "Jun 3", value: 68 },
  { date: "Jun 8", value: 78 },
  { date: "Jun 13", value: 82 },
  { date: "Jun 18", value: 77 },
  { date: "Jun 23", value: 85 },
  { date: "Jun 30", value: 79 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          Value: <span className="tooltip-number">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const Chart = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

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

  return (
    <div className={`chart-container ${isVisible ? "visible" : ""}`}>
      <div
        className={`chart-wrapper ${animationStep >= 2 ? "chart-animate" : ""}`}
      >
        <div className="chart-glow"></div>
        <ResponsiveContainer width="100%" height={343}>
          <RechartsAreaChart
            data={data}
            margin={{
              top: 30,
              right: 40,
              left: 40,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="sophisticatedGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%"   stopColor="#E6F0FF" stopOpacity={0.95}/>
  <stop offset="35%"  stopColor="#6DA3F5" stopOpacity={0.8}/>
  <stop offset="65%"  stopColor="#3678F0" stopOpacity={0.65}/>
  <stop offset="100%" stopColor="#0A1E40" stopOpacity={0.45}/>
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

            <ReferenceLine
              y={65}
              stroke="#3678f0"
              strokeDasharray="2 2"
              strokeOpacity={.5}
            />

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
