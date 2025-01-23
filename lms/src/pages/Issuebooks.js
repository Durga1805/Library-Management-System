import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function Issuebooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books');
        setBooks(response.data || []); // Ensure books is an array
        setLoading(false);
      } catch (error) {
        setError('Error fetching books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle book return
  const handleReturnBook = async (bookId) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/books/return/${bookId}`);
      
      if (response && response.data && response.status === 200) {
        const { fine } = response.data;
        
        // Update the book's status and fine locally
        const updatedBooks = books.map((book) => 
          book._id === bookId ? { ...book, status: 'Active', fine } : book
        );
        setBooks(updatedBooks);
        alert(`Book returned successfully. Fine: Rs. ${fine}`);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert('Error returning book');
    }
  };
  

  // Handle logout function
  const handleLogout = () => {
    alert('Logged out successfully');
    navigate('/');
  };

  // Prevent browser back button
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };
    preventBack();

    window.onunload = () => null;

    const unloadFunction = () => {
      preventBack();
    };

    return () => {
      window.removeEventListener("onunload", unloadFunction);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filter books to only show the ones with status 'Issued'
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
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Issued Books</h1>
        {issuedBooks && issuedBooks.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
            <thead className="bg-blue-500 text-white">
              <tr>

                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Reserved By</th>
                <th className="px-4 py-2">Reserved At</th>
                <th className="px-4 py-2">Issued At</th>
                <th className="px-4 py-2">Due Date</th> {/* New Due Date Column */}
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book) => (
                <tr key={book._id} className="text-gray-700">

                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.reservedBy || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {book.reservedAt ? new Date(book.reservedAt).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true, // Use 12-hour format
                    }) : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {book.issuedAt ? new Date(book.issuedAt).toLocaleString('en-US', {
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true, // Use 12-hour format
                    }) : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {book.dueDate ? new Date(book.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) : 'N/A'}
                  </td> {/* Displaying the Due Date */}
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleReturnBook(book._id)}
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
    </div>
  );
}

export default Issuebooks;
