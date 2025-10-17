import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// import AiModel from "./components/AiModel/AiModel";
import Dashboard from "./components/Dashboard/Dashboard";
import AiAgent from "./pages/AiAgent/AiAgent";
import AuthForm from "./pages/AuthForm/AuthForm";
import GroupDetails from "./pages/Home/GroupExpense/components/GroupDetails/GroupDetails";
import GroupExpense from "./pages/Home/GroupExpense/GroupExpense";
import Home from "./pages/Home/Home";
import PersonalExpense from "./pages/Home/PersonalExpense/PersonalExpense";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound/NotFound";

import "./index.css";

// import L from "./components/Loader/Loader";
import ComingSoon from "./components/ComingSoon/ComingSoon";

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

          <Route path="aiagent" element={<AiAgent />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/" element={<NotFound />} />
          <Route path='/ComingSoon' element={<ComingSoon />} />
          <Route path="/groupdetails" element={<GroupDetails />} />
          {/* <Route path="/aimodel" element={<AiModel />} /> */}
          {/* <Route path="/l" element={<L />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
