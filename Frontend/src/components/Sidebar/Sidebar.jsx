// Frontend/src/components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Sidebar.css";
import { useStore } from "../../Context/StoreContext.jsx";

export default function Sidebar({ isOpen = false, setIsOpen }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST", credentials: "include" });
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      navigate("/landingpage", { replace: true });
      setIsOpen?.(false);
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/",
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
      children: [
        { id: "personal", label: "Personal Expense", path: "/personalexpense" },
        { id: "group", label: "Group Expense", path: "/groupexpense" },
      ],
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
    {
      id: "logout",
      label: "Logout",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const handleParentClick = (item) => {
    // On mobile, use click-to-toggle for dropdowns
    if (item.children) {
      setOpenDropdown((prev) => (prev === item.id ? null : item.id));
      return;
    }
    if (item.id === "logout") {
      handleLogout();
      return;
    }
    // No children: close drawer after navigate
    setIsOpen?.(false);
  };

  return (
    <aside id="app-sidebar" className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-hidden={!isOpen}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="SplitMate" className="brand-icon" />
          <span className="brand-text">SplitMate</span>
        </div>
      </div>

      <nav className="sidebar-nav">
  {navItems.map((item) => {
    const isActive =
      location.pathname === item.path ||
      item.children?.some((c) => location.pathname.startsWith(c.path));

    const itemClass = `nav-item ${isActive ? "active" : ""}`;

    const isMobile = window.innerWidth <= 768;

    return (
      <div
        key={item.id}
        className="nav-wrapper"
        onMouseEnter={() => !isMobile && item.children && setOpenDropdown(item.id)}
        onMouseLeave={() => !isMobile && item.children && setOpenDropdown(null)}
      >
        {item.path && !item.children ? (
          <NavLink
            to={item.path}
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={() => setIsOpen?.(false)}
          >
            {item.icon}
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ) : (
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              if (item.children) {
                // Toggle dropdown (mobile)
                setOpenDropdown((prev) => (prev === item.id ? null : item.id));
              } else {
                handleParentClick(item);
              }
            }}
            aria-expanded={openDropdown === item.id}
            aria-controls={item.children ? `${item.id}-dropdown` : undefined}
          >
            {item.icon}
            <span className="nav-text">{item.label}</span>
            {item.children && (
              <svg
                className={`chev ${openDropdown === item.id ? "rot" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </button>
        )}

        {item.children && (
          <div
            id={`${item.id}-dropdown`}
            className={`dropdown ${openDropdown === item.id ? "open" : ""}`}
            role="menu"
          >
            {item.children.map((child) => (
              <NavLink
                key={child.id}
                to={child.path}
                className={({ isActive }) => `dropdown-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setIsOpen?.(false);
                  setOpenDropdown(null);
                }}
                role="menuitem"
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


      <div className="sidebar-footer">
        <div className="user-profile">
          <img className="user-avatar" src={`https://robohash.org/${user?.username}.png`} alt="avatar" />
          <div className="user-info">
            <p className="user-name">{user?.username || "Guest"}</p>
            <p className="user-role">{user?.email || "guest@gmail.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
