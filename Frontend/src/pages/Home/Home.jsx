import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Card from '../../components/Card/card'
import "./Home.css";
import DatePicker from "../../components/DatePicker/Datepicker";
import Chart from "../../components/Chart/Chart";

const Home = () => {
  return (
    <div className="Home-Container">
      <Sidebar />
      <div className="main-content">
        <div className="cards">
          <div className="card-small" id="greet"><p>Hello,<br/><span className="gradient-text">Aryan Gupta</span></p></div>
          <div className="card-small"><Card/></div>
          <div className="card-small"><DatePicker/></div>
        </div>
        <div className="card-large"><Chart/></div>
      </div>
    </div>
  );
};

export default Home;
