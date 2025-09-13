import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css'

const Home = () => {
  return (
    <div className='Home-Container'>
      <Sidebar />
      <div className="main-content">
        This is main content
      </div>
    </div>
  );
};

export default Home;