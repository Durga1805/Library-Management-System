import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch books from the backend
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/books');
      if (!response.ok) throw new Error('Failed to fetch books.');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle book booking
  const handleBookBooking = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/book/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });

      if (response.ok) {
        alert('Book reserved successfully!');
        fetchBooks();
      } else {
        alert('Failed to reserve the book.');
      }
    } catch (error) {
      console.error('Error booking the book:', error);
    }
  };

  // Handle request availability
  const handleRequestAvailability = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/request/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });

      if (response.ok) {
        alert('Request sent successfully! The book will be reserved for you once available.');
        fetchBooks();
      } else {
        alert('Failed to send request.');
      }
    } catch (error) {
      console.error('Error requesting availability:', error);
    }
  };

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/userpage');

  const handleProfileClick = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <div className="relative" ref={dropdownRef}>
            <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
              &larr; Back
            </button>
            <div
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
              onClick={handleProfileClick}
            >
              <span className="text-white">P</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mt-20">
        <h3 className="text-2xl font-bold mb-4">Library Books</h3>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book._id} className="bg-white p-4 rounded shadow hover:shadow-md">
                <h4 className="text-lg font-bold">{book.title}</h4>
                <p className="text-gray-700">Author: {book.author}</p>
                <p className="text-gray-700">Accession Number: {book.accno}</p>
                <p className="text-gray-600">Status: {book.status}</p>

                {book.status === 'Available' ? (
                  <button
                    onClick={() => handleBookBooking(book._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    onClick={() => handleRequestAvailability(book._id)}
                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  >
                    Booking 
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
