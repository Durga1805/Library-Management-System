import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page on button click
  };

  return (
    <div 
      className="home flex flex-col items-center justify-between h-screen bg-center" 
      style={{ 
        backgroundImage: `url(${require('../assets/lms3.jpg')})`,
        backgroundSize: '100%', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Header Section */}
      <header className="w-full p-4 bg-gradient-to-r from-blue-500 to-red-500 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome to AJCE LMS</h1>
        <div className="flex items-center space-x-4">
          <button 
            className="bg-white text-blue-500 px-4 py-2 rounded" 
            onClick={handleLoginClick} // Add onClick event for navigation
          >
            Login
          </button>
          {/* Profile picture can be added here later when logged in */}
        </div>
      </header>

      {/* Main Content Section */}
      <div className="flex-grow flex items-center justify-center">
        {/* Content can go here */}
      </div>
    </div>
  );
}

export default Home;
