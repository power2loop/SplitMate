import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound/NotFound";
import AuthForm from "./pages/AuthForm/AuthForm";
import Home from "./pages/Home/Home";
import AiAgent from "./pages/AiAgent/AiAgent";

import Dashboard from "./components/Dashboard/Dashboard";
import PersonalExpense from "./pages/Home/PersonalExpense/PersonalExpense";
import GroupExpense from "./pages/Home/GroupExpense/GroupExpense";
import GroupDetails from "./pages/Home/GroupExpense/components/GroupDetails/GroupDetails";
import AiModel from "./components/AiModel/AiModel";
import "./index.css";
import L from "./components/Loader/Loader";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/LandingPage" element={<LandingPage />} />

          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="groupexpense/*" element={<GroupExpense />} />
            <Route path="personalexpense" element={<PersonalExpense />} />
          </Route>

          <Route path='aiagent' element={<AiAgent />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/groupdetails" element={<GroupDetails />} />
          <Route path="/aimodel" element={<AiModel />} />
          <Route path="/l" element={<L/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
