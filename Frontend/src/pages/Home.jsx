import React from 'react'
import CTA from '../components/CTA/CTA';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Hero/Hero';
import Navbar from '../components/Navbar/Navbar';

const Home = () => {
  return (
    <>
      <div className="home">
        <Navbar />
        <Hero />
        <Features />
        <CTA />
      </div>
      <Footer />
    </>
  )
}

export default Home