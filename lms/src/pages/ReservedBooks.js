import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const ReservedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleIssueBook = async (bookId) => {
    try {
      await axios.patch(`http://localhost:8080/api/books/issue/${bookId}`, { status: 'Issued' });
      const response = await axios.get('http://localhost:8080/api/books');
      setBooks(response.data || []);
      alert('Book issued successfully');
    } catch (error) {
      alert('Error issuing book');
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

  // Filter books to only show the ones with status 'Reserved'
  const reservedBooks = books.filter((book) => book.status === 'Reserved');

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
            <Link to="/manage-books" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Reserved Books</h1>
        {reservedBooks && reservedBooks.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Acc. No</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Reserved By</th>
                <th className="px-4 py-2">Reserved At</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservedBooks.map((book) => (
                <tr key={book._id} className="text-gray-700">
                  <td className="border px-4 py-2">{book.accno}</td>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.reservedBy || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {book.reservedAt ? new Date(book.reservedAt).toLocaleString('en-US', {
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true, // Use 12-hour format
                    }) : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleIssueBook(book._id)}
                    >
                      Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No reserved books found.</div>
        )}
      </div>
    </div>
  );
};

export default ReservedBooks;
