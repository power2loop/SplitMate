import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home-Container">
      <Sidebar />
      <div className="main-content">
        <div className="card-small" id="greet"><p>Hello,<br/><span className="gradient-text">Aryan Gupta</span></p></div>
        <div className="card-small">Card 2</div>
        <div className="card-small">Card 3</div>
        <div className="card-large">Big Bottom Card</div>
      </div>
    </div>
  );
};

export default Home;
