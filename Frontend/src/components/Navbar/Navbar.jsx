import React, { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsRobot } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useStore } from '../../Context/StoreContext.jsx';


import "./Navbar.css";



const Navbars = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useStore();


  const location = useLocation();
  let isLocation = true;

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGroupExpenseClick = () => {
    setIsDropdownOpen(false);
    navigate("/groupExpense");
  };

  const handleLogout = async () => {
    try {
      // Tell server to clear the httpOnly cookie
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // even if the request fails, clear client state to be safe
    } finally {
      setUser(null);
      // Adjust this route if your landing page path differs
      navigate("/landingpage", { replace: true });
    }
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

        {(location.pathname === "/personalexpense") && (
          <button className="invite-btn" onClick={
            () => { navigate('/groupexpense') }
          }>
            👨‍👩‍👧‍👦 Group
          </button>
        )}

        {(location.pathname === "/groupexpense") && (
          <button className="settings-btn" onClick={() => {
            navigate('/personalexpense')
          }}>🧑‍🦱 Personal</button>

        )}
        <div
          className={`nav-right-user-profile ${isDropdownOpen ? "active" : ""}`}
          onClick={handleProfileClick}
          title="User Profile"
        >
          <img className="navs-right-user-initials" src={`https://robohash.org/${user?.username}.png`}/>
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
                <img className="user-avatar-small-logo" src={`https://robohash.org/${user?.username}.png`}/>
                <span className="user-name-logo">{user?.username || 'Guest'}</span>
              </div>
            </div>

            <div className="dropdown-divider-logo" />

            <div className="dropdown-options-logo">
              <button
                className="dropdown-option-logo"
                onClick={handleGroupExpenseClick}
              >
                <BsRobot /> <span>AI Agent</span>
              </button>

              <button
                className="dropdown-option-logo"
                onClick={handleLogout}
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
