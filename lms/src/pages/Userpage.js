import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userImage from '../assets/user.jpg'; // Import the background image

const UserPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('name') || 'User'; // Get userId from local storage
  const profilePic = localStorage.getItem('profilePic'); // Get profile picture from local storage
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
  const dropdownRef = useRef(null); // Reference to detect click outside dropdown

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };
 console.log(localStorage)
    preventBack();
    window.onbeforeunload = function () {
      return "Are you sure you want to leave this page?";
    };

    // Clean up on component unmount
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // Handle dropdown toggle
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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
            {/* Profile Picture with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  onClick={handleProfileClick} // Toggle dropdown on click
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={handleProfileClick} // Toggle dropdown on click
                >
                  <span className="text-white">P</span>
                </div>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul>
                    <li>
                      <Link
                        to="/edit-user-details" // Route for editing user details
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/view-profile" // Route for viewing profile
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
          <h2 className="text-2xl mb-8 text-black">Welcome {userId}</h2> {/* Display the user's ID */}
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
