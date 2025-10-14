// pages/Home/Home.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import logo from '../../assets/logo.png';
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const isHomeOnly = location.pathname === "/";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="Home-Container">
      {/* Sidebar (add a prop/class to control mobile open) */}
      {isHomeOnly && (
        <>
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          {/* Overlay only for mobile drawer */}
          <div
            className={`sidebar-overlay ${sidebarOpen ? "is-visible" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />



          {/* Top bar visible on ≤1024px */}
          <header className="app-topbar">
            <div className="topbar-left">
              <img src={logo} alt="logo" className="topbar-logo" />
              <h1 className="topbar-title">SplitMate</h1>
            </div>
            <button
              className="menu-btn"
              type="button"
              aria-label="Open menu"
              aria-controls="app-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>
        </>

      )}
      <Outlet />
    </div>
  );
};

export default Home;
