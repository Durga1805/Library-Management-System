import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function Staff_issuedbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profilePic = localStorage.getItem('profilePic');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/books`, {
          params: { userId },
        });

        const issuedBooks = response.data.filter((book) => book.reserved === userId);
        setBooks(issuedBooks);
        setLoading(false);
      } catch (error) {
        setError('Error fetching books: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    alert('Logged out successfully');
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && !dropdown.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    navigate('/staffpage');
  };

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const differenceInTime = today - due;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const fine = differenceInDays > 0 ? Math.ceil(differenceInDays) * 2 : 0;
    return fine > 1000 ? 1000 : fine; // Cap fine at ₹1000
  };

  const handlePayFine = async (bookId, fine) => {
    if (fine <= 0) {
      alert('No fine to pay for this book.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/payments', {
        userId,
        bookId,
        amount: fine,
      });

      if (response && response.status === 200) {
        alert('Fine paid successfully!');
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId ? { ...book, fine: 0 } : book
          )
        );
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      alert('Error processing payment: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
            &larr; Back
          </button>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <div className="relative" id="profileDropdown">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <span className="text-white">P</span>
              </div>
            )}
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

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Staff Issued Books</h1>
        {books && books.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Reserved At</th>
                <th className="px-4 py-2">Issued At</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Fine</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const fine = calculateFine(book.dueDate);
                return (
                  <tr key={book._id} className="text-gray-700">
                    <td className="border px-4 py-2">{book.title}</td>
                    <td className="border px-4 py-2">{book.author}</td>
                    <td className="border px-4 py-2">
                      {book.reservedAt
                        ? new Date(book.reservedAt).toLocaleDateString('en-US')
                        : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {book.issuedAt
                        ? new Date(book.issuedAt).toLocaleDateString('en-US')
                        : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {book.dueDate
                        ? new Date(book.dueDate).toLocaleDateString('en-US')
                        : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">₹{fine}</td>
                    <td className="border px-4 py-2">
                      {fine > 0 && (
                        <button
                          onClick={() => handlePayFine(book._id, fine)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Pay Fine
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found.</div>
        )}
      </div>
    </div>
  );
}

export default Staff_issuedbooks;
