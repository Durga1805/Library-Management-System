import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StaffPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // Set default as null or an empty string
  const dropdownRef = useRef(null);

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

  // Toggle dropdown menu
  const handleProfileClick = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4 items-center">
            <h6 className="text-white hover:text-gray-200">{name ? name : 'User'}</h6>
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
                    {/* <li>
                      <Link
                        to="/edit-staff-details"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/s_view-profile"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        View Profile
                      </Link>
                    </li> */}
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
          <h2 className="text-2xl mb-8 text-black">Welcome, {name ? name : 'User'}!</h2> 

          {/* Navigation Links */}
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
                to="/S_issued-books"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Issued Books
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to="/S_feedback"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Feedback
              </Link>
            </li>
            <li className="mb-4">
              {/* <Link 
                to="/history"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                History
              </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
