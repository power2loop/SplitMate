import React, { useState } from "react";
import Navbars from "../../../components/PersonalExpenses/Navbar/Navbars";
import Dashboard from "../../../components/GroupExpenses/Dashboard/Dashboard";
import ExpenseForm from "../../../components/PersonalExpenses/ExpenseForm/ExpenseForm";
import GroupDetails from "../../../components/GroupExpenses/GroupDetails/GroupDetails";
import { Routes, Route } from "react-router-dom";
import "./GroupExpense.css";

const GroupExpense = () => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="group-expense">
      {/* Sticky navbar at top */}
      <nav className="group-expense-nav">
        <Navbars onNavigate={setActiveView} />
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
