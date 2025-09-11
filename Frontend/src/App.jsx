import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AuthForm from './pages/AuthForm/AuthForm';
import './index.css';

const url = "http://localhost:5000/";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="/register" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App;