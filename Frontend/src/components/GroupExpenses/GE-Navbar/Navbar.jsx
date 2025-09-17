import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/l2.png";
import { Link, useNavigate } from "react-router-dom";
import { MdGroupAdd } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";

import "./Navbar.css";

const Navbars = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGroupExpenseClick = () => {
    setIsDropdownOpen(false);
    navigate("/home/groupExpense");
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    // Add logout logic here
    // localStorage.removeItem('user');
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbars">
      {/* Brand Logo */}
      <div className="nav-brand-left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 className="brand-text-logo-left">
            <img
              src={logo}
              alt="SplitMate Logo"
              style={{ width: "40px", height: "45px" }}
            />
            SplitMate
          </h2>
        </Link>
      </div>

      {/* User Profile Dropdown */}
      <div className="navs-right" ref={dropdownRef}>
        <button className="invite-btn">
          👨‍👩‍👧‍👦 Group
        </button>
        <button className="settings-btn">🧑‍🦱 Personal</button>
        <div
          className={`nav-right-user-profile ${isDropdownOpen ? "active" : ""}`}
          onClick={handleProfileClick}
          title="User Profile"
        >
          <span className="navs-right-user-initials">VK</span>
          <svg
            className={`profile-dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="profile-dropdown-menu-logo">
            <div className="dropdown-header-logo">
              <div className="user-info-logo">
                <div className="user-avatar-small-logo">VK</div>
                <span className="user-name-logo">Vik Kumar</span>
              </div>
            </div>

            <div className="dropdown-divider-logo" />

            <div className="dropdown-options-logo">
              <button
                className="dropdown-option-logo"
                onClick={handleGroupExpenseClick}
              >
                <MdGroupAdd /> <span>Group Expense</span>
              </button>

              <button
                className="dropdown-option-logo"
                onClick={handleLogoutClick}
              >
                <RiLogoutBoxRFill />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbars;
