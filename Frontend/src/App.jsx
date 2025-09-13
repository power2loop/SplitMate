import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import NotFound from './pages/NotFound/NotFound';
import AuthForm from './pages/AuthForm/AuthForm';
import Home from './pages/Home/Home'
import PersonalExpense from './pages/PersonalExpense/PersonalExpense';
import './index.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/error" element={<NotFound />} />
          <Route path="/person" element={<PersonalExpense />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;