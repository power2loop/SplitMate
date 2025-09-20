import React from 'react';
import { ArrowRight, Download, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CTA.css';

const CTA = () => {

  const navigate = useNavigate();
  
  return (
    <section className="cta lp-section" id='CTA'>
      <div className="container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="lp-heading-2 animate-fade-in">
              Ready to simplify your
              <span className="gradient-text"> expense sharing?</span>
            </h2>
            <p className="lp-text-large lp-text-muted animate-fade-in">
              Join thousands of users who have already made their financial lives easier. 
              Start splitting expenses the smart way today.
            </p>
            
            <div className="cta-features animate-slide-in-left">
              <div className="cta-feature">
                <Star className="icon icon-accent" />
                <span>Free to get started</span>
              </div>
              <div className="cta-feature">
                <Download className="icon icon-accent" />
                <span>Available on all platforms</span>
              </div>
              <div className="cta-feature">
                <Shield className="icon icon-accent" />
                <span>Bank-level security</span>
              </div>
            </div>
            
            <div className="cta-actions animate-scale-in">
              <button className="lp-btn lp-btn-primary lp-btn-large cta-primary" onClick={() => navigate('register')}>
                <span>Get Started Free</span>
                <ArrowRight className="icon" />
              </button>
              <button className="lp-btn lp-btn-secondary lp-btn-large">
                Download App
              </button>
            </div>
          </div>
          
          <div className="cta-visual animate-slide-in-right">
            <div className="cta-stats">
              <div className="stat-card">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">$50M+</div>
                <div className="stat-label">Expenses Split</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.9★</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;