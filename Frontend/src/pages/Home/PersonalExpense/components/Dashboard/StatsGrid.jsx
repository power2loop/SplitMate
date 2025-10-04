import React from "react";

import "./Dashboard.css";

const StatsGrid = ({ expenses }) => {
  // Get current date info
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  // Calculate previous month and year
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastYear = currentYear - 1;

  // Helper function to check if date matches month/year
  const isDateInPeriod = (dateString, targetMonth, targetYear) => {
    const date = new Date(dateString);
    return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
  };

  // Calculate This Month Total
  const thisMonthExpenses = expenses.filter((expense) =>
    isDateInPeriod(expense.date, currentMonth, currentYear)
  );
  const thisMonthTotal = thisMonthExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate Previous Month Total
  const previousMonthExpenses = expenses.filter((expense) =>
    isDateInPeriod(expense.date, lastMonth, lastMonthYear)
  );
  const previousMonthTotal = previousMonthExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate Same Month Last Year Total
  const sameMonthLastYearExpenses = expenses.filter((expense) =>
    isDateInPeriod(expense.date, currentMonth, lastYear)
  );
  const sameMonthLastYearTotal = sameMonthLastYearExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate Investment Total (ALL Investment category expenses)
  const investmentExpenses = expenses.filter((expense) => expense.category === "Investment");
  const totalInvestments = investmentExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate last month's investment total for growth calculation
  const lastMonthInvestments = expenses
    .filter(
      (expense) =>
        isDateInPeriod(expense.date, lastMonth, lastMonthYear) && expense.category === "Investment"
    )
    .reduce((total, expense) => total + expense.amount, 0);

  // Calculate investment growth percentage
  const calculateGrowthPercent = () => {
    if (lastMonthInvestments === 0 && totalInvestments > 0) return "100.0";
    if (lastMonthInvestments === 0) return "0.0";
    const growth = ((totalInvestments - lastMonthInvestments) / lastMonthInvestments) * 100;
    return growth.toFixed(1);
  };

  const investmentGrowthPercent = calculateGrowthPercent();

  // Calculate vs last month difference
  const monthDifference = thisMonthTotal - previousMonthTotal;
  const monthDifferenceText =
    monthDifference === 0
      ? "--"
      : monthDifference > 0
        ? `+₹${Math.abs(monthDifference).toFixed(2)}`
        : `-₹${Math.abs(monthDifference).toFixed(2)}`;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === 0) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace(/^₹/, "₹");
  };

  console.log("📊 StatsGrid Debug Info:", {
    currentMonth: currentMonth + 1,
    currentYear,
    lastMonth: lastMonth + 1,
    lastMonthYear,
    totalExpenses: expenses.length,
    thisMonthExpenses: thisMonthExpenses.length,
    previousMonthExpenses: previousMonthExpenses.length,
    sameMonthLastYearExpenses: sameMonthLastYearExpenses.length,
    thisMonthTotal,
    previousMonthTotal,
    sameMonthLastYearTotal,
    totalInvestments,
  });

  return (
    <div className="stats-grid">
      {/* This Month Card */}
      <div className="stats-card this-month-card">
        <div className="card-header">
          <div className="card-icon this-month-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" fill="currentColor" />
            </svg>
          </div>
          <div className="card-info">
            <h3>THIS MONTH</h3>
            <p className="card-value">{formatCurrency(thisMonthTotal)}</p>
            <div className="card-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Previous Month</span>
                <span className="breakdown-value">{formatCurrency(previousMonthTotal)}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Same Month Last Year</span>
                <span className="breakdown-value">{formatCurrency(sameMonthLastYearTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investments Card */}
      <div className="stats-card investments-card">
        <div className="card-header">
          <div className="card-icon investments-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="card-info">
            <h3>INVESTMENTS</h3>
            <p className="card-value">{formatCurrency(totalInvestments)}</p>
            <div className="investment-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      totalInvestments > 0
                        ? `${Math.min(Math.max(Math.abs(parseFloat(investmentGrowthPercent)), 0), 100)}%`
                        : "0%",
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {parseFloat(investmentGrowthPercent) > 0
                  ? "+"
                  : parseFloat(investmentGrowthPercent) < 0
                    ? ""
                    : ""}
                {investmentGrowthPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
