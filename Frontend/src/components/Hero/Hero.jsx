import React, { useState } from "react";
import { ArrowRight, Users, Calculator, Smartphone } from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import "./Hero.css";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title animate-fade-in">
              Track personal & group expenses,
              <span className="gradient-text"> effortlessly</span>
            </h1>
            <p className="hero-description animate-fade-in">
              The smarter way to manage your money — split bills with friends,
              track personal expenses, and settle up without awkward
              conversations or complicated calculations.
            </p>


            <div className="hero-actions animate-scale-in">
              <a href='#CTA' className="btn btn-primary btn-large hero-cta">
                <span>Explore Splitmate</span>
                <ArrowRight className="icon" />
              </a>

              <button
                className="btn btn-secondary btn-large"
                onClick={() => setShowVideo(true)}
              >
                Watch Demo
              </button>
            </div>
          </div>

          <div className="hero-visual animate-slide-in-right">
            <div className="feature-cards">
              <div className="feature-card card-1">
                <Users className="icon icon-primary" />
                <h3>Group Management</h3>
                <p>
                  Easily create and manage shared groups for splitting expenses.
                </p>
              </div>
              <div className="feature-card card-2">
                <Calculator className="icon icon-accent" />
                <h3>Smart Calculations</h3>
                <p>
                  Automatic balance tracking for both group and personal
                  expenses.
                </p>
              </div>
              <div className="feature-card card-3">
                <Smartphone className="icon icon-primary" />
                <h3>AI Agent</h3>
                <p>Get quick answers about your spending and balances.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <HeroVideoDialog
              className="w-full h-full block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
              onClose={() => setShowVideo(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
