import React from "react";
import "./Dashboard.css";

const StatsGrid = ({ expenses }) => {
    return (
        <div className="stats-grid">
            <div className="glass-card stats-card">
                <h3>This Month</h3>
                <p className="value">₹0.00</p>
            </div>
            <div className="glass-card stats-card investments">
                <h3>Investments</h3>
                <p className="value">₹7,25,000.00</p>
            </div>
            <div className="glass-card stats-card growth">
                <h3>Growth</h3>
                <p className="value">+8.5%</p>
            </div>
        </div>
    );
};

export default StatsGrid;
