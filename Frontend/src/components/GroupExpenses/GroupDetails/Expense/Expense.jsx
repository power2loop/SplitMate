import React from 'react';
import './Expense.css';

const formatCurrency = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(num)) return '₹0';
  return `₹${num.toLocaleString()}`;
};

export const Expense = ({
  title = 'Untitled expense',
  payer = 'Unknown',
  date = '',
  amount = 0,
  category = '',
  iconBg = '#8B5CF6',
  icon = '🧾',
}) => {
  return (
    <div className="expense-row">
      <div className="left">
        <div className="thumb" style={{ backgroundColor: iconBg }}>
          <span className="thumb-icon">{icon}</span>
        </div>
        <div className="texts">
          <div className="title">{title}</div>
          <div className="sub">
            {payer ? `Paid by ${payer}` : 'Paid by —'}{date ? ` • ${date}` : ''}
          </div>
        </div>
      </div>
      <div className="right">
        <div className="amt">{formatCurrency(amount)}</div>
        <div className="cat">{category}</div>
      </div>
    </div>
  );
};

export const ExpenseList = ({ items = [] }) => (
  <div className="expense-card">
    <div className="header">All Expenses</div>
    <div className="list" id='expenses'>
      {items.map((e, i) => (
        <Expense key={i} {...e} />
      ))}
    </div>
  </div>
);

export default Expense;