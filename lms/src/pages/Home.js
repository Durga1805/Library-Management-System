import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

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

  const handleOptionClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div 
      className="home flex flex-col items-center justify-between h-screen bg-center" 
      style={{ 
        backgroundImage: `url(${require('../assets/lms3.jpg')})`,
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Header */}
      <header className="w-full p-4 bg-gradient-to-r from-blue-500 to-red-500 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">LMS</h1>
        
        <nav className="flex space-x-4">
          {/* Link to List All Books */}
          <button 
            className="px-4 py-2  text-black-500 rounded-md  transition"
            onClick={() => navigate('/books')}
          >
            Books
          </button>

          {/* Link to View Newspaper */}
          <button 
            className="px-4 py-2  text-black-500 rounded-md  transition"
            onClick={() => navigate('/guestnewspaper')}
          >
            Newspaper
          </button>

          {/* Login Button */}
          <button 
            className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-gray-200 transition"
            onClick={handleOptionClick}
          >
            Login
          </button>
        </nav>
      </header>

      {/* Welcome Text */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-3xl text-white font-bold text-center">
          Welcome to Library Management System..
        </h1>
      </div>
    </div>
  );
};

export default Home;
