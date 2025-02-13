import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHistory, FaUser, FaBars, FaNewspaper } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import Header from '../components/Header';

const RequestBook = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  
  const [requestData, setRequestData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
    description: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/books/request/my-requests');
      setMyRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosInstance.post('/api/books/request', requestData);
      setMessage('Book request submitted successfully!');
      setRequestData({
        title: '',
        author: '',
        publisher: '',
        year: '',
        description: '',
        reason: ''
      });
      fetchMyRequests();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleBooksDropdown = () => {
    setIsBooksDropdownOpen(!isBooksDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <button 
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleMenu}
      >
        <FaBars />
      </button>

      <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 fixed h-full z-10 transform ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } transition-transform duration-200 ease-in-out`}>
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link to="/staffpage" className="block px-4 py-2 hover:bg-gray-600">
          Dashboard
        </Link>

        <nav className="flex flex-col space-y-3">
          {/* Books Dropdown */}
          <div className="relative">
            <button
              className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
              onClick={toggleBooksDropdown}
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

          {/* Borrowed Books */}
          <Link
            to="/my-books-details"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          <Link
            to="/lending-archives"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Lending Archives
          </Link>
          <Link
            to="/staffnewspaper"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspapers
          </Link>
         
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 transition-margin duration-200 ease-in-out">
        <Header title="Book Request" />
        
        <div className="p-4 flex flex-col md:flex-row gap-4">
          {/* Request Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <FaBook className="text-3xl text-blue-500 mr-3" />
                <h2 className="text-2xl font-semibold">Request a Book</h2>
              </div>

              {message && (
                <div className={`p-4 mb-4 rounded ${
                  message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Book Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={requestData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Author *</label>
                    <input
                      type="text"
                      name="author"
                      value={requestData.author}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      value={requestData.publisher}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Publication Year</label>
                    <input
                      type="number"
                      name="year"
                      value={requestData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={requestData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reason for Request *</label>
                  <textarea
                    name="reason"
                    value={requestData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    rows="2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>

          {/* Request History */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center mb-6">
                <FaHistory className="text-3xl text-green-500 mr-3" />
                <h2 className="text-2xl font-semibold">My Requests</h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {myRequests.map((request) => (
                  <div key={request._id} className="border rounded p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{request.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">By {request.author}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Requested on: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    {request.adminResponse && (
                      <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                        <span className="font-medium">Admin Response:</span> {request.adminResponse}
                      </p>
                    )}
                  </div>
                ))}
                {myRequests.length === 0 && (
                  <p className="text-gray-500 text-center">No requests yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBook; 