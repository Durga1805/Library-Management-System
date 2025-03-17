import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBars, FaCheck, FaTimes, FaFilter, FaSearch, FaSort } from 'react-icons/fa';
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
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [emailSending, setEmailSending] = useState(false);

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

  const sendRejectionEmail = async (requestData, reason) => {
    try {
      setEmailSending(true);
      // Send email first
      await axiosInstance.post('/api/email/send', {
        to: requestData.requestedBy.email,
        subject: `Book Request Rejected: ${requestData.title}`,
        text: `Dear ${requestData.requestedBy.name},\n\nYour request for the book "${requestData.title}" has been rejected.\n\nReason for rejection: ${reason}\n\nIf you have any questions, please contact the library staff.\n\nBest regards,\nLibrary Management System`,
        html: `
          <p>Dear ${requestData.requestedBy.name},</p>
          <p>Your request for the book "<strong>${requestData.title}</strong>" has been rejected.</p>
          <p><strong>Reason for rejection:</strong> ${reason}</p>
          <p>If you have any questions, please contact the library staff.</p>
          <p>Best regards,<br/>Library Management System</p>
        `
      });
      return true;
    } catch (error) {
      console.error('Error sending rejection email:', error);
      setMessage('Error sending rejection email. Please try again.');
      return false;
    } finally {
      setEmailSending(false);
    }
  };

  const handleRejection = async () => {
    if (!rejectionReason.trim()) {
      setMessage('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(true);
      
      // First send the email
      const emailSent = await sendRejectionEmail(selectedRequest, rejectionReason);
      
      if (emailSent) {
        // Then update the request status
        await axiosInstance.put(`/api/books/request/${selectedRequest._id}/status`, {
          status: 'rejected',
          adminResponse: rejectionReason
        });

        setMessage('Request rejected and notification email sent to user successfully.');
        fetchRequests();
      }
    } catch (error) {
      setMessage('Error processing rejection. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    }
  };

  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const handleStatusUpdate = async (requestId, status, adminResponse) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/books/request/${requestId}/status`, {
        status,
        adminResponse,
        notifyUser: true
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
                          <div className="mt-2 flex gap-2 justify-end">
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'approved', '')}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                              disabled={loading || emailSending}
                            >
                              <FaCheck className="mr-2" /> Approve
                            </button>
                            <button
                              onClick={() => openRejectionModal(request)}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                              disabled={loading || emailSending}
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

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Book Request</h3>
            <p className="text-gray-600 mb-2">Book: {selectedRequest?.title}</p>
            <p className="text-gray-600 mb-4">Requested by: {selectedRequest?.requestedBy.name}</p>
            
            <textarea
              className="w-full px-3 py-2 border rounded mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                disabled={loading || emailSending}
              >
                Cancel
              </button>
              <button
                onClick={handleRejection}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                disabled={loading || emailSending}
              >
                {emailSending ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-2" />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookRequests; 