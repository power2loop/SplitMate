import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/l2.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-brand">
            <a href="/" style={{ textDecoration: "none" }}><h2 className="brand-text">  <img src={logo} alt="logo" style={{ width: '40px', height: '45px' }} /> SplitMate</h2></a>
          </div>

          <div className={`nav-menu ${isOpen ? 'nav-menu-open' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#support" className="nav-link">Support</a>
          </div>

          <div className="nav-actions">
            <button className="btn btn-secondary">Sign In</button>
            <button className="btn btn-primary">Get Started</button>
          </div>

          <button
            className="mobile-menu-btn md-hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="icon" /> : <Menu className="icon" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;