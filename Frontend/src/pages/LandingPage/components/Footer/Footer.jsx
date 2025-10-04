import logo from "@/assets/logo.png";
import { Github, Mail } from "lucide-react";
import React from "react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="lp-footer-brand">
            <h3 className="lp-brand-text">
              <img
                src={logo}
                alt="Splitmate logo"
                style={{ width: "40px", height: "40px", marginRight: "6px" }}
              />
              Splitmate
            </h3>
            <p className="brand-description">
              Making expense sharing simple, smart, and stress-free for everyone.
            </p>

            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github className="icon" />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail className="icon" />
              </a>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Features</a></li>
                <li><a href="#" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Mobile App</a></li>
                <li><a href="#" className="footer-link">API</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Community</a></li>
                <li><a href="#" className="footer-link">Privacy</a></li>
                <li><a href="#" className="footer-link">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Splitmate. All rights reserved.
          </p>
          <p className="made-with">Made with ❤️ for better expense sharing</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
