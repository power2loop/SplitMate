import React, { useState } from "react";
import "./TransactionList.css";

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

    // Category icons mapping
    const getCategoryIcon = (category) => {
        const icons = {
            Transportation: "🚗",
            Entertainment: "🎬",
            "Food & Dining": "🍽️",
            Shopping: "🛍️",
            "Bills & Utilities": "⚡",
            Healthcare: "🏥",
            Education: "📚",
            Travel: "✈️",
            Investment: "📈",
            Other: "📦",
            Grocery: "🛒"
        };
        return icons[category] || "💰";
    };

    return (
        <div className="card-effect">
            <div className="transaction-list-container">

                <div className="transaction-header">

                    <div className="header-left">
                        <div className="back-arrow">↩</div>
                        <h2 className="transaction-title">Recent Transactions</h2>
                    </div>
                    <div className="header-controls">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="category-filter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Shopping">Grocery</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Shopping">Bills & Utilities</option>
                            <option value="Shopping">Education</option>
                            <option value="Shopping">Travel</option>
                            <option value="Shopping">Other</option>
                        </select>
                    </div>
                </div>

                <div className="transaction-list">
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                            <div key={expense.id} className="transaction-card">
                                <div className="transaction-icon">
                                    {getCategoryIcon(expense.category)}
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-name">{expense.description}</div>
                                    <div className="transaction-meta">
                                        <span className="transaction-category">{expense.category}</span>
                                        <span className="transaction-separator">•</span>
                                        <span className="transaction-date">
                                            {new Date(expense.date || Date.now()).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className="transaction-separator">•</span>
                                        <span className="transaction-time">
                                            {new Date(expense.date || Date.now()).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="transaction-amount">
                                    -₹{expense.amount.toFixed(2)}
                                </div>
                                <button
                                    onClick={() => onDeleteExpense(expense.id)}
                                    className="delete-button"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-transactions">
                            <div className="no-transactions-icon">💳</div>
                            <p>No transactions found</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TransactionList;
