import React, { useState } from 'react'; // Import React and useState hook
import axios from 'axios'; // Import axios
import { Link } from 'react-router-dom'; // Import Link for navigation
import backgroundImage from '../assets/lms2.jpg'; // Import background image

const A_SearchStaff = () => {
  const [searchType, setSearchType] = useState('userid'); // 'userid' is the default search type
  const [searchQuery, setSearchQuery] = useState(''); // Starts empty
  const [staffResults, setStaffResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Trigger the search only when a search is initiated
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query'); // Show error if query is empty
      return;
    }

    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await axios.get('http://localhost:8080/api/staff/searchstaff', {
        params: { [searchType]: searchQuery }
      });

      if (response.data.length === 0) {
        setError('No results found');
        setStaffResults([]); // Clear results if none found
      } else {
        setStaffResults(response.data); // Populate results
        setError(''); // Clear error if results are found
      }

      setLoading(false); // Stop loading after the request is done
    } catch (error) {
      console.error('Search error:', error);
      setError('Error occurred while searching.');
      setLoading(false); // Stop loading in case of error
    }
  };

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
            <Link to="/login" className="text-white hover:text-gray-200">Logout</Link>
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

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Loading Spinner */}
          {loading && <p className="mt-4">Searching...</p>}

          {/* Search Results */}
          <div className="mt-6">
            {staffResults.length > 0 ? (
              <ul>
                {staffResults.map((staff) => (
                  <li key={staff._id} className="border-b py-2">
                    {staff.userid}: {staff.name} - {staff.email} - {staff.dept}
                  </li>
                ))}
              </ul>
            ) : (
              !loading && !error && <p>No results found</p> // Add error condition to ensure only if no results and no error
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default A_SearchStaff; // Default export of the component
