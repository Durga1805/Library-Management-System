import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHistory, FaUser, FaBars, FaCheck, FaTimes, FaFilter, FaSearch ,FaSort} from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import Header from '../components/Header';

const ManageBookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('requestDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/books/request/all');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage('Error fetching requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status, adminResponse) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/books/request/${requestId}/status`, {
        status,
        adminResponse
      });
      setMessage(`Request ${status} successfully. Email notification sent to user.`);
      fetchRequests();
    } catch (error) {
      setMessage('Error updating request status. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesFilter = filter === 'all' || request.status === filter;
      const matchesSearch = searchTerm === '' || 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'requestDate') {
        return order * (new Date(b.requestDate) - new Date(a.requestDate));
      }
      return order * (a[sortBy] < b[sortBy] ? -1 : 1);
    });

  const clearMessage = () => {
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
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

      <div className="flex-1 overflow-hidden">
        <Header title="Manage Book Requests" />

        <main className="p-6 overflow-auto h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow-md">
            {/* Filters and Search */}
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-500" />
                    <select
                      className="border rounded px-3 py-2"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Requests</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaSort className="text-gray-500" />
                    <select
                      className="border rounded px-3 py-2"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="requestDate">Request Date</option>
                      <option value="title">Book Title</option>
                      <option value="status">Status</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className={`p-4 ${
                message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              } flex justify-between items-center`}>
                <span>{message}</span>
                <button onClick={clearMessage} className="text-xl">&times;</button>
              </div>
            )}

            {/* Requests List */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{request.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">By {request.author}</p>
                          <p className="text-sm text-gray-500">
                            Requested by: {request.requestedBy.name} ({request.requestedBy.dept})
                          </p>
                          <p className="text-sm text-gray-500">
                            Requested on: {new Date(request.requestDate).toLocaleString()}
                          </p>
                          <p className="mt-2 text-gray-700">{request.reason}</p>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="mt-4">
                          <textarea
                            id={`response-${request._id}`}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Add your response here..."
                            rows="2"
                          />
                          <div className="mt-2 flex gap-2 justify-end">
                            <button
                              onClick={() => handleStatusUpdate(
                                request._id,
                                'approved',
                                document.getElementById(`response-${request._id}`).value
                              )}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                            >
                              <FaCheck className="mr-2" /> Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(
                                request._id,
                                'rejected',
                                document.getElementById(`response-${request._id}`).value
                              )}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                            >
                              <FaTimes className="mr-2" /> Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {request.adminResponse && (
                        <div className="mt-4 p-3 bg-gray-50 rounded">
                          <span className="font-medium">Admin Response:</span> {request.adminResponse}
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredAndSortedRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No requests found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageBookRequests; 