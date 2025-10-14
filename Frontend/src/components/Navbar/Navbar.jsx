import logo from "@/assets/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../Context/StoreContext.jsx";
import "./Navbar.css";
import { IoIosPersonAdd } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";



const Navbars = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const location = useLocation();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGroupExpenseClick = () => {
    setIsDropdownOpen(false);
    navigate("/groupexpense");
  };

  const handlePersonalExpenseClick = () => {
    setIsDropdownOpen(false);
    navigate("/personalexpense");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // even if request fails, clear local state
    } finally {
      setUser(null);
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

      {/* Right section with user dropdown */}
      <div className="navs-right" ref={dropdownRef}>
        {/* Profile Avatar */}
        <div
          className={`nav-right-user-profile ${isDropdownOpen ? "active" : ""}`}
          onClick={handleProfileClick}
          title="User Profile"
        >
          <img
            className="navs-right-user-initials"
            src={`https://robohash.org/${user?.username}.png`}
            alt="User Avatar"
          />
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
                <img
                  className="user-avatar-small-logo"
                  src={`https://robohash.org/${user?.username}.png`}
                  alt="User Avatar"
                />
                <span className="user-name-logo">
                  {user?.username || "Guest"}
                </span>
              </div>
            </div>

            <div className="dropdown-divider-logo" />

            <div className="dropdown-options-logo">
              {/* Show only one of the two buttons depending on current route */}
              {location.pathname === "/personalexpense" && (
                <>
                <button
                  className="dropdown-option-logo"
                  onClick={handleGroupExpenseClick}
                >
                  <MdGroupAdd />
                  <span>Group Expense</span>
                </button>

                <button className="dropdown-option-logo"> 
                <BsRobot /> <a href="/aiagent"><span>AI Agent</span></a>
              </button>
              </>
              )}

              {location.pathname === "/groupexpense" && (
                <>
                <button
                  className="dropdown-option-logo"
                  onClick={handlePersonalExpenseClick}
                >
                  <IoIosPersonAdd />
                  <span>Personal Expense</span>
                </button>
                <button className="dropdown-option-logo"> 
                <BsRobot /> <a href="/aiagent"><span>AI Agent</span></a>
              </button>

                </>
              )}

              {/* AI Agent */}
              {location.pathname === "/aiagent" && (
                <>
                <button
                  className="dropdown-option-logo"
                  onClick={handlePersonalExpenseClick}
                >
                  <IoIosPersonAdd />
                  <span>Personal Expense</span>
                </button>


                <button
                  className="dropdown-option-logo"
                  onClick={handleGroupExpenseClick}
                >
                  <MdGroupAdd />
                  <span>Group Expense</span>
                </button>
                </>
              )}

              {/* Logout */}
              <button className="dropdown-option-logo" onClick={handleLogout}>
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
