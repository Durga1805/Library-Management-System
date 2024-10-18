import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StaffPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState(''); // State to hold the name

  useEffect(() => {
    // Retrieve the name from localStorage (assuming it was stored during login)
    const storedName = localStorage.getItem('name'); // Ensure 'name' is stored during login
    if (storedName) {
      setName(storedName); // Set the name in state
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    localStorage.removeItem('userId'); // Clear userId from localStorage
    localStorage.removeItem('name'); // Clear name from localStorage
    navigate('/'); // Navigate to the login or home page after logout
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
            <Link 
              to=""  // Route for profile (can be changed)
              className="text-white hover:text-gray-200"
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}  // Use the handleLogout function
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
          backgroundImage: `url(${require('../assets/Staff.jpg')})`,
        }}
      >
        <div className="bg-white bg-opacity-100 p-10 rounded-lg text-left mt-20">
          <h1 className="text-4xl font-bold mb-6 text-black">LMS</h1>
          {/* Display name or fallback to 'User' */}
          <h2 className="text-2xl mb-8 text-black">Welcome, {name ? name : 'User'}!</h2> 
          <ul>
            <li className="mb-4">
              <Link 
                to="/ssearch"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Search Books
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Issued Books
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Feedback
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to=""
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
