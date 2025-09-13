import React, { useState } from "react";
import "./Datepicker.css";

const DatePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 13)); // September 13, 2025
  const [selectedDate, setSelectedDate] = useState(13);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`calendar-day ${day === selectedDate ? 'selected' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="datepicker-container">
      <div className="datepicker-header">
        <div className="month-year-selector">
          <h3 className="current-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button className="dropdown-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
        </div>
        <div className="navigation-buttons">
          <button 
            className="nav-button prev"
            onClick={() => navigateMonth(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button 
            className="nav-button next"
            onClick={() => navigateMonth(1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="day-headers">
          {dayNames.map((day, index) => (
            <div key={index} className="day-header">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
