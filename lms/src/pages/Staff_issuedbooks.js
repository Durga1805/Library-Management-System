import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function Staff_issuedbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fine, setFine] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'Staff';
  const profilePic = localStorage.getItem('profilePic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books', {
          params: { userId},
        });

        const today = new Date();
        const issuedBooks = response.data.filter((book) => {
          const issuedDate = new Date(book.issuedAt);
          return (
            book.issuedBy === userId || 
            issuedDate.getDate() === today.getDate() &&
            issuedDate.getMonth() === today.getMonth() &&
            issuedDate.getFullYear() === today.getFullYear()
          );
        });

        setBooks(issuedBooks);
        setLoading(false);
      } catch (err) {
        setError('Error fetching books: ' + (err.response?.data?.message || err.message));
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

  const handleReturnBook = (bookId, fineAmount) => {
    setSelectedBookId(bookId);
    setFine(fineAmount);
    setShowModal(true);
  };

  const confirmReturn = async () => {
    try {
      if (fine > 0) {
        alert(`Please process the payment of ₹${fine} before returning.`);
        return;
      }
  
      // Directly confirm return if fine is 0
      await axios.post(`http://localhost:8080/api/return/${selectedBookId}/confirm`, {
        paymentSuccess: true,  // Marking payment as successful
      });
  
      setBooks(books.filter((book) => book._id !== selectedBookId));
      alert('Book returned successfully');
      setShowModal(false);
    } catch (err) {
      alert('Error returning book: ' + (err.response?.data?.message || err.message));
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
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
          <nav className="flex space-x-4 items-center">
          <h6 className="text-white hover:text-gray-200">{name ? name : 'User'}</h6>
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
                <span className="text-white">{name.charAt(0)}</span>
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
          </nav>
        </div>
      </header>

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Staff Issued Books</h1>
        {books.length > 0 ? (
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
              {books.map((book) => (
                <tr key={book._id} className="text-gray-700">
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">₹{book.fine || 0}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleReturnBook(book._id, book.fine)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="font-bold mb-4">Confirm Return</h2>
            <p>{fine > 0 ? `You have a fine of ₹${fine}. Please complete payment to return the book.` : "No fine. You can return the book directly."}</p>

            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={confirmReturn} className="bg-green-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
              <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff_issuedbooks;
