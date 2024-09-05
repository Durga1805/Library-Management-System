// Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);  
  };

  return (
    <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='flex items-center'>
          <Link to="/">
            <h1 className='text-3xl font-bold text-white hover:text-gray-300 transition-colors duration-300'>LMS</h1>
          </Link>
        </div>

        <div className='flex items-center gap-7'>
          {isLoggedIn && (
            <>
              <button 
                onClick={handleBack} 
                className='px-4 py-2 rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors duration-300'
              >
                Back
              </button>

              <button 
                onClick={handleLogout} 
                className='px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors duration-300'
              >
                Logout
              </button>
            </>
          )}

          <div className='relative flex items-center'>
            <Link to="/profile" className='text-3xl cursor-pointer text-white'>
              <FaUserCircle />
            </Link>
            <div className='absolute bg-white top-12 right-0 w-48 p-3 shadow-lg rounded-lg hidden'>
              {/* Dropdown content here */}
            </div>
          </div>

          {!isLoggedIn && (
            <Link to="/login" className='px-4 py-2 rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300'>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
