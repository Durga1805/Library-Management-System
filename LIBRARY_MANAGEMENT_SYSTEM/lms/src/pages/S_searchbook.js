import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const S_searchbook = () => {
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    setTimeout(preventBack, 0);

    // Prevent back navigation on unload
    window.onunload = function () {
      return null;
    };
  }, []);

  // Handle the search process
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results if valid input
      navigate(`/search-books?type=${searchType}&query=${searchQuery}`);
    } else {
      // Show error message for empty input
      const searchTypeLabel = searchType.charAt(0).toUpperCase() + searchType.slice(1);
      setErrorMessage(`Please enter a valid ${searchTypeLabel}.`);
    }
  };

  // Handle logout by clearing local storage and redirecting to login
  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token from localStorage
    localStorage.removeItem('userId');  // Clear userId from localStorage
    navigate('/');  // Redirect to login page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="bg-blue-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Library Management System</h1>
          <nav className="flex space-x-4">
            <Link to="/staffpage" className="text-white hover:text-gray-300">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
          </nav>
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
                setErrorMessage(''); // Clear error message when typing
              }}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <span role="img" aria-label="search" className="mr-1">🔍</span> Search
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
