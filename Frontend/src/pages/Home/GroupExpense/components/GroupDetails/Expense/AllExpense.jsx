import React from 'react';
import { ExpenseList } from './Expense';
import './Expense.css';

const demoItems = [
  { title: 'Taxi to Airport', payer: 'You', date: 'Jan 17, 2024', amount: 0, category: 'Transportation', icon: '🚕', iconBg: '#06B6D4' },
  { title: 'Dinner at Beach Shack', payer: 'Jane Smith', date: 'Jan 16, 2024', amount: 0, category: 'Food & Dining', icon: '🍽️', iconBg: '#22D3EE' },
  { title: 'Hotel Booking', payer: 'You', date: 'Jan 15, 2024', amount: 0, category: 'Accommodation', icon: '🏨', iconBg: '#8B5CF6' }
];

const AllExpenses = () => (
  <div className="expense-demo-page">
    <ExpenseList items={demoItems} />
  </div>
);

export default AllExpenses;