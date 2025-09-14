import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home-Container">
      <Sidebar />
      
      <Outlet />
    </div>
  );
};

export default Home;
