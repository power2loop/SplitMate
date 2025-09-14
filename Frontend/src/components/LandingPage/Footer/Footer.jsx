import React from 'react';
import { Github, Mail } from 'lucide-react';
import logo from '../../../assets/l2.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="brand-text"> <img src={logo} alt="" style={{ width: '40px', height: '40px', marginRight: '3px' }} /> Splitmate</h3>
            <p className="brand-description">
              Making expense sharing simple, smart, and stress-free for everyone.
            </p>
            <div className="social-links">

              <a href="#" className="social-link">
                <Github className="icon" />
              </a>
              <a href="#" className="social-link">
                <Mail className="icon" />
              </a>
            </div>
          </div>

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

        <div className="footer-bottom">
          <p className="copyright">
            © 2025 Splitmate. All rights reserved.
          </p>
          <p className="made-with">
            Made with ❤️ for better expense sharing
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;