import React, { useState, useEffect } from 'react';  // Import React hooks
import { useNavigate } from 'react-router-dom';      // Import useNavigate

const Home = () => {
  const navigate = useNavigate(); 
  const [showDropdown, setShowDropdown] = useState(false); // State to show/hide the dropdown

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    preventBack();
    window.onunload = function () { return null; };

    window.onbeforeunload = function () {
      return "Are you sure you want to leave this page?";
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const handleOptionClick = (role) => {
    if (role === 'staff') {
      navigate('/staff-login'); // Navigate to staff login page
    } else if (role === 'student') {
      navigate('/login'); // Navigate to student login page
    }
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
      <header className="w-full p-4 bg-gradient-to-r from-blue-500 to-red-500 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">LMS</h1>
        <div className="relative">
          <button 
            className="bg-white text-blue-500 px-4 py-2 rounded" 
            onClick={toggleDropdown}
          >
            Login
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
              <button 
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
                onClick={() => handleOptionClick('staff')}
              >
                Staff Login
              </button>
              <button 
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
                onClick={() => handleOptionClick('student')}
              >
                Student Login
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-3xl text-white font-bold text-center">
          Welcome to Library Management System..
        </h1>
      </div>
    </div>
  );
};

export default Home;
