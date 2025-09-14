import React from 'react'
import CTA from '../../components/LandingPage/CTA/CTA';
import Features from '../../components/LandingPage/Features/Features';
import Footer from '../../components/LandingPage/Footer/Footer';
import Hero from '../../components/LandingPage/Hero/Hero';
import Navbar from '../../components/LandingPage/Navbar/Navbar';
import './LandingPage.css'

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  )
}

export default LandingPage