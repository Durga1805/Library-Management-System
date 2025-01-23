import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const A_SearchStaff = () => {
  const [searchType, setSearchType] = useState('userid');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffResults, setStaffResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('userid'); // State to store sort field

  // Trigger the search only when a search is initiated
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/api/staff/searchstaff', {
        params: { [searchType]: searchQuery }
      });

      if (response.data.length === 0) {
        setError('No results found');
        setStaffResults([]);
      } else {
        setStaffResults(response.data);
        setError('');
      }

      setLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setError('Error occurred while searching.');
      setLoading(false);
    }
  };

  // Sort staff results based on the selected field
  const sortedResults = [...staffResults].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });

  return (
    <div>
      {/* Header Section */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <Link to="/" className="text-white hover:text-gray-200">Logout</Link>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center bg-white bg-opacity-80 p-12 rounded-lg shadow-lg w-full max-w-xl">
          <h2 className="text-3xl font-bold text-red-700 mb-8">Search Users</h2>

          {/* Search Type Dropdown and Input */}
          <div className="flex space-x-4 items-center justify-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="userid">User ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>

            <input
              type="text"
              placeholder={`Enter ${searchType}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 w-full border border-gray-300 rounded-md"
            />

            <button
              onClick={handleSearch}
              className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="mt-4">
            <label className="mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="userid">User ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Loading Spinner */}
          {loading && <p className="mt-4">Searching...</p>}

          {/* Search Results */}
          <div className="mt-6">
            {sortedResults.length > 0 ? (
              <ul>
                {sortedResults.map((staff) => (
                  <li key={staff._id} className="border-b py-2">
                    {staff.userid}: {staff.name} - {staff.email} - {staff.dept}
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <p className="mt-4 text-gray-500">No results to display.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default A_SearchStaff;
