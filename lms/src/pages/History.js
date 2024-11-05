import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference to detect click outside dropdown
  const profilePic = localStorage.getItem('profilePic'); // Get profile picture from local storage
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/history`);
        setHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePic');
    navigate('/');
  };

  // Handle dropdown toggle
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside dropdown to close it
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
  }, [dropdownRef]);

  const handleBack = () => {
    navigate('/userpage'); // Navigate back to the previous page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <button 
            onClick={handleBack} 
            className="text-white hover:text-gray-200 mr-4"
          >
            &larr; Back
          </button>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <div className="relative" ref={dropdownRef}>
            {/* Profile Picture with Dropdown */}
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
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <Link
                      to="/edit-user-details"
                      className="block px-4 py-2 text-black hover:bg-gray-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-profile"
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
        </div>
      </header>

      {/* Main Content Section */}
      <div className="container mx-auto p-6 pt-24">
        <h2 className="text-2xl font-bold mb-4">History</h2>
        <div className="bg-white shadow rounded p-4">
          {historyData.length > 0 ? (
            historyData.map((record, index) => (
              <div key={index} className="mb-4">
                <p><strong>Book:</strong> {record.bookTitle}</p>
                <p><strong>Status:</strong> {record.status}</p>
                <p><strong>Date:</strong> {record.date}</p>
                {record.fine && <p><strong>Fine:</strong> ₹{record.fine}</p>}
                <hr className="my-2" />
              </div>
            ))
          ) : (
            <p>No history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
