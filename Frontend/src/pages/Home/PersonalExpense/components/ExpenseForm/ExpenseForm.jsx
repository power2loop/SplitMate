import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../../../services/api.js"; // Adjust the import path as necessary

import "./ExpenseForm.css";

const ExpenseForm = ({ onAddExpense }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const payload = {
      title: description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const saved = await api("/expenses/personal/add", { method: "POST", body: payload });
      const normalized = {
        id: saved._id || saved.id,
        description: saved.title ?? description,
        amount: Number(saved.amount ?? payload.amount),
        category: saved.category ?? category,
        date: saved.date ?? saved.createdAt ?? new Date().toISOString(),
      };
      onAddExpense(normalized);
      setDescription("");
      setAmount("");
      setCategory("");
    } catch (err) {
      console.error("Error saving expense:", err.message);
    }
  };

  const categories = [
    { value: "Food & Dining", icon: "🍽️" },
    { value: "Grocery", icon: "🛒" },
    { value: "Transportation", icon: "🚗" },
    { value: "Shopping", icon: "🛍️" },
    { value: "Entertainment", icon: "🎬" },
    { value: "Bills & Utilities", icon: "⚡" },
    { value: "Healthcare", icon: "🏥" },
    { value: "Education", icon: "📚" },
    { value: "Travel", icon: "✈️" },
    { value: "Investment", icon: "📈" },
    { value: "Other", icon: "📦" },
  ];

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSelectedCategory = () => {
    return categories.find((cat) => cat.value === category);
  };

  return (
    <div className="expense-form-container">
      <div className="form-header">
        <div className="form-icon">
          <span>+</span>
        </div>
        <h2 className="form-title">Quick Add</h2>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-input"
          />
          <div className="input-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 10h12M2 6h12M2 14h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group amount-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              className="amount-input"
            />
          </div>

          <div className="dropdown-container" ref={dropdownRef}>
            <div className="category-button-wrapper">
              <button
                type="button"
                className={`category-dropdown ${isDropdownOpen ? "open" : ""}`}
                onClick={toggleDropdown}
              >
                <div className="button-content">
                  <div className="content-text">
                    {category ? (
                      <>
                        <span className="content-icon">{getSelectedCategory()?.icon}</span>
                        <span className="content-name">{getSelectedCategory()?.value}</span>
                      </>
                    ) : (
                      "Category"
                    )}
                  </div>
                </div>

                <div className="button-arrow">
                  <svg
                    className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                    width="15"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Category</div>
                <div className="dropdown-list">
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      className="dropdown-item"
                      onClick={() => handleCategorySelect(cat.value)}
                    >
                      <span className="category-icon">{cat.icon}</span>
                      <span className="category-name">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button">
          <span className="button-icon">+</span>
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
