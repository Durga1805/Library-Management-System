import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaNewspaper,FaBook, FaBars, FaHistory, FaUser, FaSignOutAlt, FaUndo } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';

const MyBooksDetails = () => {
  const [books, setBooks] = useState({
    reserved: [],
    issued: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/books/my-books');
      setBooks(response.data); // response.data now contains { reserved: [], issued: [] }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (bookId) => {
    try {
      await axiosInstance.post(`/api/books/cancel-reservation/${bookId}`);
      fetchMyBooks(); // Refresh the books list after cancellation
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert(error.response?.data?.message || 'Error canceling reservation');
    }
  };

  const calculateFine = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    if (today > due) {
      const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
      return diffDays * 10; // ₹10 per day
    }
    return 0;
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setShowReturnConfirm(true);
  };

  const handleReturnConfirm = async () => {
    try {
      const response = await axiosInstance.post(`/api/books/return/${selectedBook._id}`);
      
      if (response.data.requiresPayment) {
        // If there's a fine, show payment modal
        setShowPaymentModal(true);
      } else {
        // If no fine, book is returned successfully
        setMessage('Book returned successfully');
        setShowReturnConfirm(false);
        setSelectedBook(null);
        fetchMyBooks();
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setMessage(error.response?.data?.message || 'Error returning book');
    }
  };

  const handlePayment = async () => {
    try {
      await axiosInstance.post(`/api/books/pay-fine/${selectedBook._id}`);
      setShowPaymentModal(false);
      setSelectedBook(null);
      setMessage('Payment successful and book returned');
      fetchMyBooks();
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage(error.response?.data?.message || 'Error processing payment');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 ${
        isMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link
                  to="/staffpage"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Dashboard
                </Link>

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="My Books" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>

        {/* Books List */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Reserved Books Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Reserved Books</h2>
                {books.reserved.length === 0 ? (
                  <p className="text-gray-500">No reserved books</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.reserved.map(book => (
                      <div key={book._id} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                        <p className="text-gray-600 mb-1">By {book.author}</p>
                        <p className="text-sm text-gray-500 mb-1">ISBN: {book.isbn}</p>
                        <p className="text-sm text-gray-500 mb-1">
                          Reserved on: {book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : 'N/A'}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                            Reserved
                          </span>
                          <button
                            onClick={() => handleCancelReservation(book._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Borrowed Books Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>
                {books.issued.length === 0 ? (
                  <p className="text-gray-500">No borrowed books</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.issued.map(book => (
                      <div key={book._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p className="text-gray-600">by {book.author}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <p><span className="font-medium">Issue Date:</span> {new Date(book.issuedAt).toLocaleDateString()}</p>
                          <p><span className="font-medium">Due Date:</span> {new Date(book.dueDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">Department:</span> {book.dept}</p>
                          <p><span className="font-medium">Call No:</span> {book.call_no}</p>
                          <button
                            onClick={() => handleReturnClick(book)}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                          >
                            <FaUndo className="mr-2" />
                            Return Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Confirmation Modal */}
      {showReturnConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Return</h2>
            <p className="mb-4">Are you sure you want to return "{selectedBook?.title}"?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReturnConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
            <p className="mb-2">Fine Amount: ₹{selectedBook?.fine}</p>
            <p className="mb-4 text-sm text-gray-600">Please pay the fine to complete the return process.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooksDetails; 