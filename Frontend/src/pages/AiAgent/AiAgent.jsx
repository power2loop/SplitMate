import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Spline from '@splinetool/react-spline';
import AiCard from '../../components/Aicard/AiCard';
import "./AiAgent.css";

const AiAgent = () => {
  return (
    <>
    <Navbar></Navbar>
    <div class="ai-container">
        <div className="ai-left"> 
    <AiCard></AiCard>
        </div>
        <div className="ai-right">
           <Spline scene="https://prod.spline.design/AuVjvJMgGsHmZ-Of/scene.splinecode" />
        </div>
    </div>
    </>
  )
}

export default AiAgent;

















