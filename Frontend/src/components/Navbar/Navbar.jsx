import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/l2.png';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">

          {/* Brand Logo */}
          <div className="nav-brand">
            <Link to="/" style={{ textDecoration: "none" }}>
            {/* <img
                  src={logo}
                  alt="logo"
                  style={{ width: '40px', height: '45px' }}
                /> */}

              <h2 className="brand-text-logo">
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: '40px', height: '45px' }}
                />
                SplitMate
              </h2>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className={`nav-menu ${isOpen ? 'nav-menu-open' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#support" className="nav-link">Support</a>
          </div>

          {/* Action Buttons */}
          <div className="nav-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Sign In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
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
