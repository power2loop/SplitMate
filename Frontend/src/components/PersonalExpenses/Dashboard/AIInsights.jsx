import React from "react";
import "./Dashboard.css";

const AIInsights = ({ expenses }) => {
    // Helper function to analyze expenses and generate insights
    const generateInsights = () => {
        if (!expenses || expenses.length === 0) {
            return "Start tracking your expenses to get personalized AI insights!";
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter current month expenses
        const thisMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear;
        });

        if (thisMonthExpenses.length === 0) {
            return "No expenses recorded this month. Great opportunity to start tracking!";
        }

        // Calculate category totals
        const categoryTotals = {};
        thisMonthExpenses.forEach(expense => {
            categoryTotals[expense.category] =
                (categoryTotals[expense.category] || 0) + expense.amount;
        });

        // Find highest spending category
        const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b
        );

        const highestAmount = categoryTotals[highestCategory];
        const totalSpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const categoryPercentage = ((highestAmount / totalSpent) * 100).toFixed(0);

        // Generate different insights based on data
        const insights = [
            {
                condition: highestCategory === "Transportation" && highestAmount > 3000,
                message: "Transportation costs have increased. Consider carpooling or public transit options."
            },
            {
                condition: highestCategory === "Food & Dining" && highestAmount > 5000,
                message: `You've spent ₹${highestAmount.toFixed(0)} on dining this month. Try cooking at home to save money!`
            },
            {
                condition: highestCategory === "Shopping" && categoryPercentage > 30,
                message: `Shopping represents ${categoryPercentage}% of your expenses. Consider setting a monthly shopping budget.`
            },
            {
                condition: highestCategory === "Entertainment" && highestAmount > 2000,
                message: "Entertainment expenses are high. Look for free or low-cost activities to balance your budget."
            },
            {
                condition: highestCategory === "Investment" && highestAmount > 0,
                message: `Great job investing ₹${highestAmount.toFixed(0)} this month! Keep building your financial future.`
            },
            {
                condition: highestCategory === "Bills & Utilities" && categoryPercentage > 40,
                message: "Utility bills are consuming a large portion of your budget. Check for energy-saving opportunities."
            },
            {
                condition: Object.keys(categoryTotals).length > 5,
                message: `You're spending across ${Object.keys(categoryTotals).length} categories. Focus on your top 3 priorities to optimize spending.`
            },
            {
                condition: totalSpent < 10000,
                message: "You're maintaining excellent spending discipline this month. Keep up the great work!"
            }
        ];

        // Find the first applicable insight
        const applicableInsight = insights.find(insight => insight.condition);

        return applicableInsight ? applicableInsight.message :
            `Your highest spending category is ${highestCategory} at ₹${highestAmount.toFixed(0)}. Consider reviewing this area for potential savings.`;
    };

    // Get AI icon based on expense analysis
    const getAIIcon = () => {
        if (!expenses || expenses.length === 0) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
                </svg>
            );
        }

        // Different icons based on insights
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear;
        });

        const hasInvestments = thisMonthExpenses.some(exp => exp.category === "Investment");

        if (hasInvestments) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor" />
                </svg>
            );
        }

        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    return (
        <div className="ai-insights-card">
            <div className="ai-insights-header">
                <div className="ai-icon">
                    {getAIIcon()}
                </div>
                <h2>AI Financial Insights</h2>
            </div>
            <p>
                {generateInsights()}
            </p>
        </div>
    );
};

export default AIInsights;
