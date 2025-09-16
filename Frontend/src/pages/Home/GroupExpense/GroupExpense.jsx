import React, { useState } from "react";
import Navbars from "../../../components/PersonalExpenses/Navbar/Navbars";
import Dashboard from "../../../components/GroupExpenses/Dashboard/Dashboard";
import ExpenseForm from "../../../components/PersonalExpenses/ExpenseForm/ExpenseForm";
import GroupDetails from "../../../components/GroupExpenses/GroupDetails/GroupDetails";
import "./GroupExpense.css"
const GroupExpense = () => {
  // state to track current active view
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <>
      {/* Navbar always visible */}
      <Navbars onNavigate={setActiveView} />

      {/* Conditional Rendering */}
      {activeView === "dashboard" && <Dashboard />}
      {activeView === "expenseForm" && <ExpenseForm />}
      {activeView === "groupDetails" && <GroupDetails />}
    </>
  );
};

export default GroupExpense;
