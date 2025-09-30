// Frontend/src/components/Dashboard/Dashboard.jsx
import React from "react";

import Chart from "../Chart/Chart";

import "./Dashboard.css";

import { useStore } from "../../Context/StoreContext.jsx";
import ExpenseCard from "../ExpenseCard/ExpenseCard";
import WalletCard from "../WalletCard/WalletCard";

const Dashboard = () => {
  const { user } = useStore();

  return (
    <div className="main-content">
      <div className="cards">
        <div className="card-small" id="greet">
          <p>
            Hello,
            <br />
            <span className="gradient-text">{user?.username || "Guest"}</span>
          </p>
        </div>
        <div className="card-small">
          <ExpenseCard />
        </div>
        <div className="card-small">
          <WalletCard />
        </div>
      </div>
      <div className="card-large">
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;
