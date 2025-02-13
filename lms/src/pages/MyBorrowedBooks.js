import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBook, FaCalendar, FaClock, FaMoneyBill, FaBars, FaHistory, FaUser, FaUserCircle, FaUndo, FaTimes } from 'react-icons/fa';
import { handleLogout } from '../utils/auth';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';

const MyBorrowedBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState({
    reserved: [],
    issued: []
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      console.log('Fetching books with token:', token, 'for user:', userId);
  
      const response = await axios.get(
        'http://localhost:8080/api/books/my-books',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Response from server:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setMessage(error.response?.data?.message || 'Error fetching your books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setShowReturnConfirm(true);
  };

  const handleReturnConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/books/return/${selectedBook._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
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

  const handleCancelReservation = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/books/cancel-reservation/${bookId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage(response.data.message);
      fetchMyBooks();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      setMessage(error.response?.data?.message || 'Error canceling reservation');
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/books/pay-fine/${selectedBook._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setShowPaymentModal(false);
      setSelectedBook(null);
      setMessage('Payment successful and book returned');
      fetchMyBooks();
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage(error.response?.data?.message || 'Error processing payment');
    }
  };

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        
          {/* View Books */}
          <Link 
            to="/userpage" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Dashboard
          </Link>
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
            <FaHistory className="mr-2" />
            Newspaper
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="My Borrowed Books" />

        <main className="flex-1 p-4 overflow-auto">
          {loading && (
            <div className="max-w-7xl mx-auto mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
              Loading your books...
            </div>
          )}
          {message && (
            <div className="max-w-7xl mx-auto mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
              {message}
            </div>
          )}

          {/* Reserved Books Section */}
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-4">Reserved Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!loading && books.reserved.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No reserved books</p>
              ) : (
                books.reserved.map(book => (
                  <div key={book._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-gray-600">by {book.author}</p>
                      </div>
                      <button
                        onClick={() => handleCancelReservation(book._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Cancel Reservation"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p><span className="font-medium">Reserved On:</span> {new Date(book.reservedAt).toLocaleDateString()}</p>
                      <p><span className="font-medium">Department:</span> {book.dept}</p>
                      <p><span className="font-medium">Call No:</span> {book.call_no}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Issued Books Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Issued Books</h2>
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
                    <p><span className="font-medium">Days Left:</span> {calculateDaysLeft(book.dueDate)}</p>
                    <button
                      onClick={() => handleReturnClick(book)}
                      className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FaUndo className="mr-2" />
                      Return Book
                    </button>
                  </div>
                </div>
              ))}
              {books.issued.length === 0 && (
                <p className="col-span-full text-center text-gray-500">No issued books</p>
              )}
            </div>
          </div>
        </main>
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

export default MyBorrowedBooks; 