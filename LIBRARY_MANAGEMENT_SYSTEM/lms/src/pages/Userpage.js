import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userImage from '../assets/user.jpg'; // Import the background image

const UserPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'User'; // Get userId from local storage
  const profilePic = localStorage.getItem('profilePic'); // Get profile picture from local storage

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    preventBack();
    window.onbeforeunload = function () {
      return "Are you sure you want to leave this page?";
    };

    // Clean up on component unmount
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId from local storage
    localStorage.removeItem('profilePic'); // Optional: Clear profilePic if desired
    navigate('/'); // Redirect to the login page after logging out
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            {/* Profile Picture in Header */}
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white">P</span>
              </div>
            )}
            <Link
              to="/edit-user-details" // Route for editing user details
              className="text-white hover:text-gray-200"
            >
              Edit
            </Link>
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
          backgroundImage: `url(${userImage})`, // Use imported image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-50 p-10 rounded-lg text-left">
          <h2 className="text-2xl mb-8 text-black">Welcome UserId: {userId}</h2> {/* Display the user's ID */}
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
                to="/issued-books" // Route for issued books
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Issued Books
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to="/feedback" // Route for feedback
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Feedback
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to="/history" // Route for history
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
