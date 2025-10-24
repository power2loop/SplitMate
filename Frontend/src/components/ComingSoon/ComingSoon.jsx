
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbars from '../../components/Navbar/Navbar'
import "./ComingSoon.css";

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date("2025-12-31T00:00:00").getTime(); // ⏰ launch date

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className="comingsoon-container">
      <div className="gradient-bg"></div>

      <motion.div
        className="coming-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1 id="title">🚀 Coming Soon</h1>
        <p className="subtitle">Something awesome is on the way...</p>

        <div className="countdown">
          <div className="time-box">
            <span>{timeLeft.days}</span>
            <p>Days</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.hours}</span>
            <p>Hours</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.mins}</span>
            <p>Minutes</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.secs}</span>
            <p>Seconds</p>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
}
