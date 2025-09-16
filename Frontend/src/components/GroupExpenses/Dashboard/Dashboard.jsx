import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            {/* Top Summary Section */}
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h2>₹35,400</h2>
                    <p>Total Expenses This Month</p>
                </div>
                <div className="summary-card">
                    <h2>3</h2>
                    <p>Active Groups</p>
                </div>
                <div className="summary-card">
                    <h2>₹150</h2>
                    <p>You're Owed</p>
                </div>
            </div>

            {/* Groups Section */}
            <div className="dashboard-groups">
                <h2>Your Groups</h2>

                <div className="group-card">
                    <div className="group-info">
                        <h3>Goa Trip 2024</h3>
                        <p>Beach vacation with friends</p>
                        <div className="group-stats">
                            <span>👥 3 members</span>
                            <span>🧾 3 expenses</span>
                        </div>
                        <div className="group-members">
                            <span className="avatar blue">Y</span>
                            <span className="avatar green">JS</span>
                            <span className="avatar pink">MJ</span>
                        </div>
                    </div>

                    <div className="group-right">
                        <div className="total-spent">
                            <p>Total Spent</p>
                            <h2>₹18,600</h2>
                        </div>
                        <div className="your-balance">
                            <p>Your Balance</p>
                            <span>₹0</span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="dashboard-actions">
                    <button className="join-btn">⇾ Join Group</button>
                    <button className="create-btn">＋ Create Group</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
