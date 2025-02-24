import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBook, FaUser, FaHistory, FaSignOutAlt, FaUserCircle, FaNewspaper } from 'react-icons/fa';
import { handleLogout } from '../utils/auth';
import Header from '../components/Header';
import BookRecommendations from '../components/BookRecommendations';
import DueReminders from '../components/DueReminders';


const UserPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Retrieve user details from local storage
  const name = localStorage.getItem('name') || 'User'; // Use a default if undefined
  const address = localStorage.getItem('address') || 'No Address';
  const phone = localStorage.getItem('phone') || 'No Phone';
  const profilePic = localStorage.getItem('profilePic') || ''; // Optional profile picture
  
  const dropdownRef = useRef(null); // Reference to detect click outside dropdown

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    console.log(localStorage); // Log to check storage values
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
    setIsProfileDropdownOpen(!isProfileDropdownOpen); // Toggle dropdown
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        
          {/* View Books */}
          
          <Link 
            to="/view-books" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            View Books
          </Link>

          {/* My Borrowed Books */}
          <Link 
            to="/my-borrowed-books" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          {/* Profile Settings */}
          <Link 
            to="/studentprofile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>
          <Link 
            to="/my-history" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My History
          </Link>
          <Link 
            to="/student-newspaper" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspaper
          </Link>
          <Link 
            to="/book-request" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Request Book
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-1 flex flex-col">
        <Header title="Student Dashboard" />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <DueReminders />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Access Cards */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/view-books" className="flex flex-col items-center">
                  <FaBook className="text-4xl text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold">Browse Books</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Search and view available books in the library
                  </p>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/my-borrowed-books" className="flex flex-col items-center">
                  <FaHistory className="text-4xl text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold">My Borrowed Books</h3>
                  <p className="text-gray-600 text-center mt-2">
                    View your currently borrowed books and history
                  </p>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/studentprofile" className="flex flex-col items-center">
                  <FaUser className="text-4xl text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold">Profile Settings</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Update your profile and preferences
                  </p>
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/student-newspaper" className="flex flex-col items-center">
                  <FaNewspaper className="text-4xl text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold">Newspaper</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Read and download newspapers
                  </p>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/book-request" className="flex flex-col items-center">
                  <FaBook className="text-4xl text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold">Request Book</h3>
                  <p className="text-gray-600 text-center mt-2">
                    Request a new book from the library
                  </p>
                </Link>
              </div>
            </div>

            <div className="mb-8">
              <BookRecommendations />
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default UserPage;
