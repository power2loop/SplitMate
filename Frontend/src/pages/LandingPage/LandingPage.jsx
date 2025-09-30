import React from "react";

import CTA from "./components/CTA/CTA";
import Features from "./components/Features/Features";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";

import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="lp-main">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
