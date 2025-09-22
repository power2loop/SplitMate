import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/home",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="nav-icon"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>

      ),
      children: [
        { id: "personal", label: "Personal Expense", path: "/home/personalexpense" },
        { id: "group", label: "Group Expense", path: "/home/groupexpense" },
      ],
    },
    {
      id: "profile",
      label: "Profile",
      path: "/home/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "aiagent",
      label: "AI Agent",
      path: "/aiagent",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="SplitMate" className="brand-icon" />
          <span className="brand-text">SplitMate</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            item.children?.some((c) => location.pathname.startsWith(c.path));
          return (
            <div
              key={item.id}
              className="nav-wrapper"
              onMouseEnter={() => item.children && setOpenDropdown(item.id)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              {item.path ? (
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `nav-item ${isActive || isActive ? "active" : ""}`
                  }
                >
                  {item.icon}
                  <span className="nav-text">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.id ? null : item.id)
                  }
                >
                  {item.icon}
                  <span className="nav-text">{item.label}</span>
                </button>
              )}

              {item.children && (
                <div className={`dropdown ${openDropdown === item.id ? "open" : ""}`}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path}
                      className={({ isActive }) =>
                        `dropdown-item ${isActive ? "active" : ""}`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">AG</div>
          <div className="user-info">
            <p className="user-name">Aryan Gupta</p>
            <p className="user-role">Developer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
