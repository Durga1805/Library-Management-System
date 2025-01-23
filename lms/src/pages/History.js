import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profilePic = localStorage.getItem('profilePic');
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'User';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (!userId) {
      
      navigate('/');
     // Redirect to login if not logged in
    }

// In History.js
const fetchHistory = async () => {
  try {
    setLoading(true);
    // Update the URL to match the backend route
    const response = await axios.get(`/books/history?userId=${userId}`);
    setHistoryData(response.data);
  } catch (error) {
    setError('Failed to load history. Please try again later.');
  } finally {
    setLoading(false);
  }
};


    fetchHistory();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
    <div className="flex flex-col min-h-screen">
      <header className="h-16 bg-gradient-to-r from-blue-500 to-red-700 shadow-lg fixed w-full z-40">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <button onClick={() => navigate('/userpage')} className="text-white hover:text-gray-300">
            &larr; Back
          </button>
          <h1 className="text-xl font-bold text-white">LMS - History</h1>
          <nav className="flex space-x-4 items-center">
          <h6 className="text-white hover:text-gray-200">{name ? name : 'User'}</h6>
            {/* Profile Picture with Dropdown */}
            </nav>
          <div className="relative" ref={dropdownRef}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                P
              </div>
            )}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto mt-20 px-4">
        <h2 className="text-2xl font-bold mb-4">Activity History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : historyData.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Fine (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{entry.title}</td>
                  <td className="border px-4 py-2">{entry.type}</td>
                  <td className="border px-4 py-2">{entry.date || 'N/A'}</td>
                  <td className="border px-4 py-2">{entry.fine || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default History;
