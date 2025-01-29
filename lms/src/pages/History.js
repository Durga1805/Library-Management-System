import React, { useEffect, useState, useRef } from 'react'; // Import useRef for dropdown management
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const History = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown state
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'User';
  const profilePic = localStorage.getItem('profilePic'); // Assuming profilePic URL is stored in localStorage
  const dropdownRef = useRef(null); // Using useRef for the dropdown management

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

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (selectedBook) {
      const fine = calculateFine(selectedBook.dueDate);
      if (fine > 0) {
        alert(`You have a pending fine of ₹${fine}. Payment integration is required.`);
      } else {
        await handleReturnBook(selectedBook._id);
      }
    }
    setIsModalOpen(false);
  };

  const handleReturnBook = async (bookId) => {
    try {
      await axios.post(`http://localhost:8080/api/books/return`, { bookId });
      alert('Book returned successfully!');
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      alert('Error returning book: ' + error.message);
    }
  };

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const differenceInTime = today - due;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const fine = differenceInDays > 0 ? Math.ceil(differenceInDays) * 2 : 0;
    return fine > 1000 ? 1000 : fine; // Cap fine at ₹1000
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <div>
            <h6 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/userpage')}>
              Back
            </h6>
          </div>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
          <h6 className="text-white hover:text-gray-200">{name ? name : 'User'}</h6>
          <div className="relative">
            
            {/* Profile Picture and Dropdown */}
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-white"
            >
             
            
            <div className="relative">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  onClick={toggleDropdown} // Toggle dropdown on click
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
                
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  {name.charAt(0)}
                </div>
              )}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-black text-left hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            </button>
          </div>
          </nav>
          </div>
        
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your History</h1>
        {books.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
  <tr>
    <th className="px-4 py-2">Title</th>
    <th className="px-4 py-2">Issue Date</th> {/* New Column */}
    <th className="px-4 py-2">Due Date</th>
    <th className="px-4 py-2">Fine</th>
    
  </tr>
</thead>

<tbody>
  {books.map((book) => {
    const fine = calculateFine(book.dueDate);
    return (
      <tr key={book._id} className="text-gray-700">
        <td className="border px-4 py-2">{book.title}</td>
        <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td> {/* Issue Date */}
        <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td> {/* Due Date */}
        <td className="border px-4 py-2">₹{fine}</td>
       
      </tr>
    );
  })}
</tbody>

          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="font-bold mb-4">Confirm Return</h2>
            <p>Are you sure you want to return this book?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleConfirmReturn}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
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

export default History;
