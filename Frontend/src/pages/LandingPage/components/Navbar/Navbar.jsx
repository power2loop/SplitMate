import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="lp-navbar">
      <div className="container">
        <div className="lp-nav-content">
          {/* Brand Logo */}
          <div className="lp-nav-brand">
            <h2 className="lp-brand-text-logo">
              <img
                src={logo}
                alt="logo"
                style={{ width: "40px", height: "45px" }}
              />
              SplitMate
            </h2>
          </div>

          {/* Navigation Links */}
          <div className={`lp-nav-menu ${isOpen ? "lp-nav-menu-open" : ""}`}>
            <a href="#features" className="lp-nav-link">
              Features
            </a>
            <a href="#how-it-works" className="lp-nav-link">
              How it works
            </a>
            {/* <a href="#pricing" className="lp-nav-link">
              Pricing
            </a> */}
            <a href="#support" className="lp-nav-link">
              <span className="rate">Rate Us</span><i class="ri-bard-line"></i>
            </a>

            {/* Actions inside dropdown on mobile */}
            <div className="lp-nav-actions mobile-actions">
              <button
                className="lp-btn lp-btn-secondary"
                onClick={() => navigate("/register")}
              >
                Sign In
              </button>
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="lp-nav-actions desktop-actions">
            <button
              className="lp-btn lp-btn-secondary"
              onClick={() => navigate("/register")}
            >
              Sign In
            </button>
            <button
              className="lp-btn lp-btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lp-mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="lp-icon" /> : <Menu className="lp-icon" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
