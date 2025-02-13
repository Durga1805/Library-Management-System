import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBook, FaUser, FaHistory, FaSignOutAlt, FaNewspaper } from 'react-icons/fa';
import { handleLogout } from '../utils/auth';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import Notifications from '../components/Notifications';
import BookRecommendations from '../components/BookRecommendations';
import StaffRecommendations from '../components/StaffRecommendations';

const StaffPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    dueReturns: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch statistics
      const statsResponse = await axiosInstance.get('/api/books/statistics');
      setStats(statsResponse.data);

      // Fetch recent activities
      const activitiesResponse = await axiosInstance.get('/api/books/recent-activities');
      setRecentActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 ${
        isMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
          {/* Books Dropdown */}
          <div className="relative">
            <button
              className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="mt-2 py-2 bg-gray-700 rounded-md">
                <Link
                  to="/viewbooks"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  View Books
                </Link>
                
                
              </div>
            )}
          </div>

          {/* Profile Settings */}
          <Link
            to="/staffprofile"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>

          <Link
            to="/staffnewspaper"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspapers
          </Link>

          {/* Borrowed Books */}
          <Link
            to="/my-books-details"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          {/* Lending Archives */}
          <Link
            to="/lending-archives"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Lending Archives
          </Link>

          {/* Logout */}
         
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Staff Dashboard" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Access Cards */}
            <Link
              to="/viewbooks"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FaBook className="text-3xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">Browse Books</h3>
                  <p className="text-gray-600">View available books in the library</p>
                </div>
              </div>
            </Link>

            <Link
              to="/my-books-details"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FaHistory className="text-3xl text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">My Borrowed Books</h3>
                  <p className="text-gray-600">View your borrowed and reserved books</p>
                </div>
              </div>
            </Link>

            <Link
              to="/staffprofile"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FaUser className="text-3xl text-purple-500" />
                <div>
                  <h3 className="text-lg font-semibold">Profile Settings</h3>
                  <p className="text-gray-600">Update your profile information</p>
                </div>
              </div>
            </Link>

            <Link
              to="/staffnewspaper"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FaNewspaper className="text-3xl text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">Newspaper</h3>
                  <p className="text-gray-600">Read and download newspapers</p>
                </div>
              </div>
            </Link>

            <Link
              to="/staffSuggestion"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FaBook className="text-3xl text-purple-500" />
                <div>
                  <h3 className="text-lg font-semibold">Book Suggestion  </h3>
                  <p className="text-gray-600">Which book is you want suggest or request it</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <StaffRecommendations />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
