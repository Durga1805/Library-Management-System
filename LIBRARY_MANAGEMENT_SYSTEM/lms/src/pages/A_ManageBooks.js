import React, { useEffect } from 'react';
import { Link, useNavigate, usePrompt } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const A_ManageBooks = () => {
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = () => {
    // Clear authentication tokens or any related data
    navigate('/');
  };

  // Use Prompt to block navigation
  const isBlocking = true; // Set this based on a condition (e.g., form unsaved, session active)

  useEffect(() => {
    // Prevent history back navigation
    const preventBack = () => {
      window.history.forward();
    };

    preventBack();

    window.onbeforeunload = function () {
      return "Are you sure you want to leave this page?";
    };

    return () => {
      window.onbeforeunload = null; // Clean up on component unmount
    };
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div 
        className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-80 p-12 rounded-lg shadow-lg text-center w-full max-w-lg">
          <h1 className="text-4xl font-bold text-red-700 mb-8">Book Details</h1>
          <div className="flex flex-col items-center space-y-4">
            <Link 
              to="/add-books"
              className="w-full text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Adding Books
            </Link>
            
            <Link 
              to="/A_search"
              className="w-full text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Search Books
            </Link>
            <Link 
              to="/listbook"
              className="w-full text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Books
            </Link>
            <Link 
              to="/reserved"
              className="w-full text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Reserved Books 
            </Link>
            <Link 
              to="/issued"
              className="w-full text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300"
            >
               Issue Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A_ManageBooks;
