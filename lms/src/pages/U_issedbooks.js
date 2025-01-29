import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const U_issuedbooks = () => {
  const [books, setBooks] = useState([]);
  const name = localStorage.getItem('name') || 'User';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const profilePic = localStorage.getItem('profilePic') || ''; // Optional profile picture

  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books', {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching books: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    fetchBooks();
  }, [userId, token]);

  const calculateFine = (dueDate) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    if (currentDate > due) {
      const daysLate = Math.ceil((currentDate - due) / (1000 * 60 * 60 * 24));
      return daysLate * 2;
    }
    return 0;
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleConfirmReturn = async () => {
    try {
      const { _id: bookId } = selectedBook;
      await axios.patch(`http://localhost:8080/api/books/return/${bookId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      alert('Book returned successfully!');
      setIsModalOpen(false);
    } catch (error) {
      alert('Error returning the book: ' + error.message);
    }
  };

  const handleFinePayment = async () => {
    try {
      const fineAmount = calculateFine(selectedBook.dueDate);
      const response = await axios.post('http://localhost:8080/api/payments', {
        userId, bookId: selectedBook._id, amount: fineAmount
      });
      const { orderId } = response.data;
      
      const options = {
        key: 'rzp_test_uMGUQEKTOz0D0k',
        amount: fineAmount * 100,
        currency: 'INR',
        name: 'Library Management',
        description: `Fine payment for book: ${selectedBook.title}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post('http://localhost:8080/api/payments/verify', response);
            alert('Payment successful! Returning book...');
            handleConfirmReturn();
          } catch (error) {
            alert('Payment verification failed!');
          }
        },
        prefill: { name },
        theme: { color: '#3399cc' },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Error initiating payment: ' + error.message);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh', color: 'white' }}
    >
      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Books Issued</h1>
        {books.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Issue Date</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Fine</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="text-gray-700">
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">₹{calculateFine(book.dueDate)}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleReturnClick(book)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No books issued.</div>
        )}
      </div>
      {isModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="font-bold mb-4">Confirm Return</h2>
            <p>Fine: ₹{calculateFine(selectedBook.dueDate)}</p>
            {calculateFine(selectedBook.dueDate) > 0 ? (
              <button onClick={handleFinePayment} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4">Pay Fine Online</button>
            ) : (
              <button onClick={handleConfirmReturn} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4">Confirm Return</button>
            )}
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mt-4 ml-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default U_issuedbooks;
