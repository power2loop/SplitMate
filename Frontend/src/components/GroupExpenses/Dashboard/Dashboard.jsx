import React from "react";
import "./Dashboard.css";

const demoGroups = [
    {
        id: "goa-2024",
        name: "Goa Trip 2024",
        description: "Beach vacation with friends",
        membersCount: 3,
        expensesCount: 3,
        totalSpent: 18600,
        balance: 0,
        members: [
            { id: "y", initials: "Y", color: "blue" },
            { id: "js", initials: "JS", color: "green" },
            { id: "mj", initials: "MJ", color: "pink" },
        ],
    },
];

const currency = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Dashboard = () => {
    return (
        <div className="dash-root">
            {/* Header row */}
            <div className="dash-topbar">
                <h1>Your Groups</h1>
                <div className="dash-actions">
                    <button className="btn ghost">↪ Join Group</button>
                    <button className="btn primary">＋ Create Group</button>
                </div>
            </div>

            {/* Groups grid */}
            <div className="groups-grid">
                {demoGroups.map((g) => (
                    <button key={g.id} className="group-card" onClick={() => console.log("open group", g.id)}>
                        <div className="card-left">
                            <h3 className="group-title">{g.name}</h3>
                            <p className="group-sub">{g.description}</p>
                            <div className="group-meta">
                                <span>👥 {g.membersCount} members</span>
                                <span>🧾 {g.expensesCount} expenses</span>
                            </div>
                            <div className="avatars">
                                {g.members.map((m) => (
                                    <span key={m.id} className={`avatar ${m.color}`}>{m.initials}</span>
                                ))}
                            </div>
                        </div>

                        <div className="card-right">
                            <div className="total-spent">
                                <p>Total Spent</p>
                                <h2>{currency(g.totalSpent)}</h2>
                            </div>
                            <div className="your-balance">
                                <p>Your Balance</p>
                                <span>{currency(g.balance)}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
