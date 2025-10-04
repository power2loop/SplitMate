// Frontend/src/components/Dashboard/Dashboard.jsx
import React from "react";
import { useStore } from "../../Context/StoreContext.jsx";
import WalletCard from "../WalletCard/WalletCard";
import GreetBot from "../GreetBot/GreetBot.jsx"
import Chart from "../Chart/Chart";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useStore();

  return (
    <div className="main-content">
      <div className="cards">
        <div className="card-small" id="greet">
          <p>Hello,<br /><span className="gradient-text">{user?.username ? user.username.split(" ")[0] : "Guest"}</span></p>
          <GreetBot/>
        </div>
        {/* <div className="over"></div> */}
        <div className="card-small" id="data-card">
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
