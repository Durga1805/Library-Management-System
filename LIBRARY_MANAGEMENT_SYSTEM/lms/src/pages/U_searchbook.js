import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const U_searchbook = () => {
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('userch');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?type=${searchType}&query=${searchQuery}`);
    } else {
      // Set error message if search query is empty
      const searchTypeLabel = searchType.charAt(0).toUpperCase() + searchType.slice(1);
      setErrorMessage(`Please enter a valid ${searchTypeLabel}.`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="bg-blue-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Library Management System</h1>
          <nav className="flex space-x-4">
            <Link to="/userpage" className="text-white hover:text-gray-300">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${require('../assets/user.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* Combined Book Collection and Search Section */}
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-white text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">Book Collection</h2>
          <p className="text-lg">Search or browse through the library’s books here.</p>
        </div>

        {/* Tabs for Books and Periodicals */}
        <div className="flex mb-4 justify-center space-x-4">
          <button
            onClick={() => handleTabClick('userch')}
            className={`text-lg font-semibold py-2 px-6 rounded-md transition duration-150 ${
              activeTab === 'userch' ? 'bg-gray-300 text-blue-600 shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => handleTabClick('UPeriodicals')}
            className={`text-lg font-semibold py-2 px-6 rounded-md transition duration-150 ${
              activeTab === 'UPeriodicals' ? 'bg-gray-300 text-blue-600 shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Periodicals
          </button>
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

export default U_searchbook;
