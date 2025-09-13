import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../../assets/l2.png'

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      )
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      )
    }
  ];

  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <img src={logo} alt="" />
          </div>
          <span className="brand-text">
            SplitMate</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            data-tooltip={item.label}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id);
            }}
          >
            {item.icon}
            <span className="nav-text">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <a href="#" className="user-profile">
          <div className="user-avatar">
            MA
          </div>
          <div className="user-info">
            <p className="user-name">Manu Arora</p>
            <p className="user-role">Developer</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;