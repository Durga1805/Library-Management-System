import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'User'; // Use userId instead of userName

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId from local storage
    navigate('/login'); // Redirect to the login page after logging out
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div 
        className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{
          backgroundImage: `url(${require('../assets/user.jpg')})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-50 p-10 rounded-lg text-left">
          <h2 className="text-2xl mb-8 text-black">Welcome UserId: {userId}</h2> {/* Display the user's name */}
          <ul>
            <li className="mb-4">
              <Link 
                to="/userch"
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
                Issued Book
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

export default UserPage;
