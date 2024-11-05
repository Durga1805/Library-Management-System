import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function U_issedbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
  const profilePic = localStorage.getItem('profilePic'); // Get profile picture from local storage

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log("Fetching books for userId:", userId);
        const response = await axios.get(`http://localhost:8080/api/books`);
        console.log("API response:", response.data);

        // Filter books that are active, reserved by the current user, and have been issued
        const issuedBooks = response.data.filter(
          books => books.reserved === userId
        );

        setBooks(issuedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError('Error fetching books: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear user ID on logout
    alert('Logged out successfully');
    navigate('/');
  };

  // Handle dropdown toggle
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('profileDropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    navigate('/userpage'); // Navigate back to the user page
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
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          {/* Back Button */}
          <button 
            onClick={handleBack} 
            className="text-white hover:text-gray-200 mr-4"
          >
            &larr; Back
          </button>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <div className="relative" id="profileDropdown">
            {/* Profile Picture with Dropdown */}
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <Link
                      to="/edit-user-details"
                      className="block px-4 py-2 text-black hover:bg-gray-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-profile"
                      className="block px-4 py-2 text-black hover:bg-gray-200"
                    >
                      View Profile
                    </Link>
                  </li>
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

      {/* Main Content */}
      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Issued Books</h1>
        {books && books.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
            <thead className="bg-blue-500 text-white">
              <tr>
               
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                
                <th className="px-4 py-2">Issued At</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="text-gray-700">
                 
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : 'N/A'}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found.</div>
        )}
      </div>
    </div>
  );
}

export default U_issedbooks;
