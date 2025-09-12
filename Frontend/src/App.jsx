import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import NotFound from './pages/NotFound/NotFound';
import AuthForm from './pages/AuthForm/AuthForm';
import Home from './pages/Home/Home'
import './index.css';
import { Globe } from "@/components/magicui/globe";

const backend_url = "http://localhost:5000/";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path= "/home" element={<Home/>}/>
        <Route path="/error" element={<NotFound />} />
        <Route path="/globe" element={<Globe />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;