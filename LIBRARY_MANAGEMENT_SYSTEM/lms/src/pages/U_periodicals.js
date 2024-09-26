import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const U_periodicals = () => {
  const [searchType, setSearchType] = useState('Search by Title');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('userch');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to the U_searchperi page with query parameters
    navigate(`/U_searchperi?searchType=${searchType}&query=${searchQuery}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'UPeriodicals') {
      navigate('/UPeriodicals');
    } else if (tab === 'userch') {
      navigate('/userch'); // Navigate to books page or the default page
    }
  };

  const handleLogout = () => {
    navigate('/login'); // Redirects to home or login page
  };

  return (
    <div>
      {/* Header Section */}
      <header className="bg-blue-500 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/userpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${require('../assets/user.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-4xl font-bold text-red-600 mb-6">Library Search</h1>

        {/* Tabs for Books and Periodicals */}
        <div className="flex mb-4">
          <button
            onClick={() => handleTabClick('userch')}
            className={`text-lg font-semibold py-2 px-6 ${
              activeTab === 'userch' ? 'bg-gray-300' : 'bg-gray-200'
            } rounded-md hover:bg-gray-300`}
          >
            Books
          </button>
          <button
            onClick={() => handleTabClick('UPeriodicals')}
            className={`text-lg font-semibold py-2 px-6 ${
              activeTab === 'UPeriodicals' ? 'bg-gray-300 text-blue-600' : 'bg-gray-200'
            } rounded-md hover:bg-gray-300 ml-4`}
          >
            Periodicals
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-xl flex items-center space-x-4">
          {/* Dropdown for Search Type */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Search by Title</option>
            <option>Search by Publisher</option>
          </select>

          {/* Input for Search Query */}
          <input
            type="text"
            placeholder={`Type ${searchType}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Search Button */}
          <button
            // onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            <span role="img" aria-label="search">🔍</span> Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default U_periodicals;
