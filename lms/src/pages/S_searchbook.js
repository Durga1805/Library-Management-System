import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const S_searchbook = () => {
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(''); // Placeholder for profile picture URL
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };
    setTimeout(preventBack, 0);

    window.onunload = function () {
      return null;
    };
  }, []);

  // Handle back button navigation
  const handleBack = () => navigate(-1);

  // Handle profile dropdown toggle
  const handleProfileClick = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle the search process
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-books?type=${searchType}&query=${searchQuery}`);
    } else {
      const searchTypeLabel = searchType.charAt(0).toUpperCase() + searchType.slice(1);
      setErrorMessage(`Please enter a valid ${searchTypeLabel}.`);
    }
  };

  // Handle logout by clearing local storage and redirecting to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
            &larr; Back
          </button>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <div className="relative" ref={dropdownRef}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <span className="text-white">P</span>
              </div>
            )}

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
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${require('../assets/Staff.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Book Collection and Search Section */}
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-white text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">Book Collection</h2>
          <p className="text-lg">Search or browse through the library’s books here.</p>
        </div>

        {/* Search Section */}
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto flex flex-col space-y-4 mb-4">
          {/* Dropdown for Search Type */}
          <div className="flex items-center space-x-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            >
              <option value="title">Search by Title</option>
              <option value="author">Search by Author</option>
            </select>

            {/* Input for Search Query */}
            <input
              type="text"
              placeholder={`Enter ${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setErrorMessage('');
              }}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
              aria-label="Search"
            >
              🔍 Search
            </button>
          </div>

          {/* Error message if query is empty */}
          {errorMessage && (
            <div className="text-red-600 font-semibold">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default S_searchbook;
