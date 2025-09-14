import React from 'react'
import Card from '../Card/card'
import DatePicker from "../DatePicker/Datepicker";
import Chart from "../Chart/Chart";
import './Dashboard.css'

const Dahsboard = () => {
  return (
    <div className="main-content">
        <div className="cards">
          <div className="card-small" id="greet"><p>Hello,<br/><span className="gradient-text">Aryan Gupta</span></p></div>
          <div className="card-small"><Card/></div>
          <div className="card-small"><DatePicker/></div>
        </div>
        <div className="card-large"><Chart/></div>
      </div>
  )
}

export default Dahsboard