import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBook, FaUsers, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import Header from '../components/Header';

const LibStaffPage = () => {
  const navigate = useNavigate();
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    dueReturns: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchReservations();
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

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/api/books/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleIssueBook = async (bookId, userId) => {
    try {
      await axiosInstance.post(`/api/books/issue/${bookId}`, {
        userId: userId,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      });
      fetchReservations(); // Refresh the reservations list
      fetchDashboardData(); // Refresh dashboard stats
    } catch (error) {
      console.error('Error issuing book:', error);
      alert(error.response?.data?.message || 'Error issuing book');
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link 
          to="/libstaffpage" 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
        >
          Dashboard
        </Link>
        <nav className="flex flex-col space-y-3">
          {/* Manage Books Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between w-full"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Manage Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/addbooks" className="block px-4 py-2 hover:bg-gray-600">Add Books</Link>
                <Link to="/search-list-books" className="block px-4 py-2 hover:bg-gray-600">Search & List Books</Link>
                <Link to="/issue-books" className="block px-4 py-2 hover:bg-gray-600">Issue Books</Link>
                
              </div>
            )}
          </div>

          {/* Manage Users Dropdown */}
          <Link 
            to="/users" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Manage Users
          </Link>

          {/* Reports & Analytics */}
          <Link 
            to="/reports" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Reports & Analytics
          </Link>

          {/* Profile Settings */}
          <Link 
            to="/profile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Profile Settings
          </Link>

          <Link 
            to="/upload-newspaper" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Upload Newspaper
          </Link>

          <Link 
            to="/manage-book-requests" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Book Requests
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Library Staff Dashboard" />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">Total Books</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">Books Issued</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.issuedBooks}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">Due Returns</h3>
                  <p className="text-3xl font-bold text-red-600">{stats.dueReturns}</p>
                </div>

                
              </div>

              {/* Recent Reservations */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Book Reservations</h2>
                {reservations.length === 0 ? (
                  <p className="text-gray-500 text-center">No pending reservations</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reserved On
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation) => (
                          <tr key={reservation._id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ISBN: {reservation.book.isbn}
                              </div>
                              <div className="text-sm text-gray-500">
                                Call No: {reservation.book.call_no}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {reservation.user.userid}
                              </div>
                              <div className="text-sm text-gray-500">
                                Dept: {reservation.user.dept}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(reservation.reservedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleIssueBook(reservation.book._id, reservation.user._id)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <FaCheckCircle className="mr-2" />
                                Issue Book
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Activities</h3>
                  <button 
                    onClick={fetchDashboardData}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Refresh
                  </button>
                </div>
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div 
                        key={activity._id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-2 h-2 rounded-full ${
                            activity.type === 'issue' ? 'bg-green-500' :
                            activity.type === 'return' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}></span>
                          <span>{activity.description}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No recent activities</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LibStaffPage;