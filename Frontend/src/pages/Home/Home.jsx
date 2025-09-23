import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const isHomeOnly = location.pathname === "/";


  return (
    <div className="Home-Container">
      {isHomeOnly && <Sidebar />}

      <Outlet />
    </div>
  );
};

export default Home;
