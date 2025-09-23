import React from 'react';
import Chart from "../Chart/Chart";
import './Dashboard.css'
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import WalletCard from '../WalletCard/WalletCard';
import { useAuth } from '../../Context/AuthContext.js'; // custom hook from context

const Dashboard = () => {
  const { user, loading } = useAuth();
  const name = loading ? '...' : (user?.username || 'Friend');

  return (
    <div className="main-content">
      <div className="cards">
        <div className="card-small" id="greet">
          <p>Hello,<br /><span className="gradient-text">{name}</span></p>
        </div>
        <div className="card-small"><ExpenseCard /></div>
        <div className="card-small"><WalletCard /></div>
      </div>
      <div className="card-large"><Chart /></div>
    </div>
  )
}

export default Dashboard;
