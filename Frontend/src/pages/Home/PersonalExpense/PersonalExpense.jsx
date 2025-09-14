import React, { useState } from "react";
import AIInsights from "../../../components/PersonalExpenses/Dashboard/AIInsights";
import StatsGrid from "../../../components/PersonalExpenses/Dashboard/StatsGrid";
import ExpenseForm from "../../../components/PersonalExpenses/ExpenseForm/ExpenseForm";
import AnalyticsChart from "../../../components/PersonalExpenses/Analytics/AnalyticsChart";
import TransactionList from "../../../components/PersonalExpenses/TransactionList/TransactionList";
import Navbar from "../../../components/PersonalExpenses/Navbar/Navbars";
import "./PersonalExpense.css";



const PersonalExpense = () => {
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense) => setExpenses([expense, ...expenses]);
    const deleteExpense = (id) =>
        setExpenses(expenses.filter((e) => e.id !== id));

    return (
        <div className="page-container">
            <div className="navbars">
                <Navbar expenses={expenses} />
            </div>

            {/* AI Insights Section */}
            <div className="ai-insights">
                <AIInsights expenses={expenses} />
            </div>

            {/* Stats Grid Section */}
            <div className="stats-grid">
                <StatsGrid expenses={expenses} />
            </div>

            {/* Dashboard Grid: Expense Form + Analytics Chart */}
            <div className="dashboard-grid">
                <div className="expense-form-container">
                    <ExpenseForm onAddExpense={addExpense} />
                </div>

                <div className="analytics-chart-container">
                    <AnalyticsChart expenses={expenses} />
                </div>
            </div>

            {/* Transaction List Section */}
            <div className="transaction-list-container">
                <TransactionList expenses={expenses} onDeleteExpense={deleteExpense} />
            </div>
        </div>
    );
};

export default PersonalExpense;
