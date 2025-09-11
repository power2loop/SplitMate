import React from 'react';
import { ArrowRight, Users, Calculator, Smartphone } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title animate-fade-in">
              Split expenses with friends, 
              <span className="gradient-text"> effortlessly</span>
            </h1>
            <p className="hero-description animate-fade-in">
              The smart way to track shared expenses, split bills, and settle up with friends. 
              No more awkward money conversations or complicated calculations.
            </p>
            <div className="hero-actions animate-scale-in">
              <button className="btn btn-primary btn-large hero-cta">
                <span>Explore Splitmate</span>
                <ArrowRight className="icon" />
              </button>
              <button className="btn btn-secondary btn-large">
                Watch Demo
              </button>
            </div>
            <div className="hero-stats animate-slide-in-left">
              <div className="stat">
                <strong>500K+</strong>
                <span>Active Users</span>
              </div>
              <div className="stat">
                <strong>$50M+</strong>
                <span>Split & Settled</span>
              </div>
              <div className="stat">
                <strong>4.9★</strong>
                <span>App Store Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-slide-in-right">
            <div className="feature-cards">
              <div className="feature-card card-1">
                <Users className="icon icon-primary" />
                <h3>Group Management</h3>
                <p>Create and manage expense groups with ease</p>
              </div>
              <div className="feature-card card-2">
                <Calculator className="icon icon-accent" />
                <h3>Smart Calculations</h3>
                <p>Automatic splitting and balance calculations</p>
              </div>
              <div className="feature-card card-3">
                <Smartphone className="icon icon-primary" />
                <h3>Mobile First</h3>
                <p>Track expenses on the go with our mobile app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;