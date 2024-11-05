import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StaffPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');

  // useEffect Hook for checking login status and token expiration
  useEffect(() => {
    // Retrieve name and token expiration from localStorage
    const storedName = localStorage.getItem('name');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    // Set name if available in localStorage
    if (storedName) {
      setName(storedName);
    }

    // Auto logout if token has expired
    if (!tokenExpiration || currentTime > tokenExpiration) {
      handleLogout();
    }
  }, []);

  // Handle Logout Function
  const handleLogout = () => {
    // Remove user-specific data from localStorage upon logout
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('tokenExpiration');
    // Navigate to the homepage (or login page)
    navigate('/');
  };

  return (
    <div>
      {/* Header Section */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            {/* Placeholder Profile link */}
            <Link 
              to="/profile"  // Profile page route can be modified
              className="text-white hover:text-gray-200"
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}  // Handle Logout button
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div 
        className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{
          backgroundImage: `url(${require('../assets/Staff.jpg')})`, // Background image
        }}
      >
        <div className="bg-white bg-opacity-100 p-10 rounded-lg text-left mt-20">
          {/* Greeting Section */}
          <h1 className="text-4xl font-bold mb-6 text-black">LMS</h1>
          {/* Display name or 'User' if name is not available */}
          <h2 className="text-2xl mb-8 text-black">Welcome, {name ? name : 'User'}!</h2> 

          {/* Navigation Links */}
          <ul>
            {/* Search Books Link */}
            <li className="mb-4">
              <Link 
                to="/ssearch"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Search Books
              </Link>
            </li>
            
            {/* Issued Books Link */}
            <li className="mb-4">
              <Link 
                to="/issued-books"  // Issued books route placeholder
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Issued Books
              </Link>
            </li>
            
            {/* Feedback Link */}
            <li className="mb-4">
              <Link 
                to="/feedback"  // Feedback route placeholder
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Feedback
              </Link>
            </li>
            
            {/* History Link */}
            <li className="mb-4">
              <Link 
                to="/history"  // History route placeholder
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
