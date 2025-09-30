import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Dashboard from "../GroupExpense/components/Dashboard/Dashboard";
import GroupDetails from "../GroupExpense/components/GroupDetails/GroupDetails";

import "./GroupExpense.css";

const GroupExpense = () => {
  // const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="group-expense">
      {/* Sticky navbar at top */}
      <nav className="group-expense-nav">
        <Navbar />
      </nav>

      {/* Page content below navbar */}
      <div className="group-expense-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="details/:groupId" element={<GroupDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default GroupExpense;
