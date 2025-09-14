import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import NotFound from './pages/NotFound/NotFound';
import AuthForm from './pages/AuthForm/AuthForm';
import Home from './pages/Home/Home'
import GE from "./pages/Home/GE/GE";
// import PE from "./pages/Home/PE/PE";
import Dashboard from './components/Dashboard/Dashboard'
import PersonalExpense from './pages/Home/PersonalExpense/PersonalExpense';
import './index.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="ge" element={<GE />} />
            <Route path="personalexpense" element={<PersonalExpense />} />
          </Route>
          <Route path="/register" element={<AuthForm />} />
          <Route path="/error" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;