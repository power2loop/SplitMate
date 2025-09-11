import React from 'react'
import CTA from '../components/CTA/CTA';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Hero/Hero';
import Navbar from '../components/Navbar/Navbar';

const Home = () => {
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

export default Home