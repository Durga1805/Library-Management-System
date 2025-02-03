import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function U_issuedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fine, setFine] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'User';
  const profilePic = localStorage.getItem('profilePic');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/books?userId=${userId}`); // Fetch only user's books
        setBooks(response.data || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching books');
        setLoading(false);
      }
    };
    fetchBooks();
  }, [userId]);

  const handleReturnBook = async (bookId) => {
    try {
      const fineResponse = await axios.get(`http://localhost:8080/api/return/${bookId}`);
      setFine(fineResponse.data.fine);
      setSelectedBook(bookId);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching fine:', error);
      alert('Error processing book return');
    }
  };

  const confirmReturn = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/return/${selectedBook}/confirm`, {
        paymentSuccess: fine === 0 ? true : false, 
      });
      alert(response.data.message);
      setShowModal(false);
      setBooks(books.map((book) => (book._id === selectedBook ? { ...book, status: 'Active' } : book)));
    } catch (error) {
      console.error('Error confirming return:', error);
      alert('Error processing book return');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFine(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const issuedBooks = books.filter((book) => book.status === 'Issued');

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <h6 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/userpage')}>
            Back
          </h6>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <div className="flex items-center space-x-4">
            <h6 className="text-white">{name}</h6>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Issued Books</h1>
        {issuedBooks.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Issue Date</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Fine</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book) => (
                <tr key={book._id} className="text-gray-700">
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">₹{book.fine || 0}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleReturnBook(book._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found.</div>
        )}
      </div>

      {/* Modal for Return Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="font-bold mb-4">Confirm Return</h2>
            {fine > 0 ? (
              <>
                <p>You have a fine of ₹{fine}. Please complete payment to return the book.</p>
                <button
                  onClick={confirmReturn}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                  Pay & Return
                </button>
              </>
            ) : (
              <p>Are you sure you want to return this book?</p>
            )}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmReturn}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default U_issuedBooks;
