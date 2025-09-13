import React, { useState } from "react";
// import "./TransactionList.css";

const TransactionList = ({ expenses, onDeleteExpense }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const filteredExpenses = expenses.filter((e) => {
        const matchesSearch =
            e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || e.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Transactions</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="transaction-card">
                        <span className="desc">{expense.description}</span>
                        <span className="amount">-₹{expense.amount}</span>
                        <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="delete-btn"
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
