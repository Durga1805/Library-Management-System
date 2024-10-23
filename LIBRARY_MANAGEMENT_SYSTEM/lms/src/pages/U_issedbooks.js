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
  
    useEffect(() => {
        const fetchBooks = async () => {
          try {
            console.log("Fetching books for userId:", userId);
            const response = await axios.get(`http://localhost:8080/api/books/issued?userId=${userId}`);
            console.log("API response:", response.data);
            setBooks(response.data || []); // Ensure books is an array
            setLoading(false);
          } catch (error) {
            console.error("Error fetching books:", error);
            setError('Error fetching books: ' + (error.response?.data?.message || error.message));
            setLoading(false);
          }
        };
    
        fetchBooks();
      }, [userId]);
    
    const handleReturnBook = async (bookId) => {
      try {
        await axios.patch(`http://localhost:8080/api/books/return/${bookId}`, { status: 'Available' });
        const response = await axios.get(`http://localhost:8080/api/books/issued?userId=${userId}`);
        setBooks(response.data || []);
        alert('Book returned successfully');
      } catch (error) {
        alert('Error returning book');
      }
    };
  
    const handleLogout = () => {
      localStorage.removeItem('userId'); // Clear user ID on logout
      alert('Logged out successfully');
      navigate('/');
    };
  
    useEffect(() => {
      const preventBack = () => {
        window.history.forward();
      };
      preventBack();
  
      window.onunload = () => null;
  
      return () => {
        window.removeEventListener("onunload", preventBack);
      };
    }, []);
  
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
            <div className='flex items-center'>
              <h1 className="text-white text-xl font-bold">LMS</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/UserDashboard" className="text-white hover:text-gray-200">Back</Link>
              <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
            </nav>
          </div>
        </header>
  
        {/* Main Content */}
        <div className="container mx-auto pt-20">
          <h1 className="text-3xl font-bold mb-6 text-center">Your Issued Books</h1>
          {books && books.length > 0 ? (
            <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-4 py-2">Acc. No</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Reserved At</th>
                  <th className="px-4 py-2">Issued At</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="text-gray-700">
                    <td className="border px-4 py-2">{book.accno}</td>
                    <td className="border px-4 py-2">{book.title}</td>
                    <td className="border px-4 py-2">{book.author}</td>
                    <td className="border px-4 py-2">{book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="border px-4 py-2">{book.issuedAt ? new Date(book.issuedAt).toLocaleDateString() : 'N/A'}</td>
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
  

export default U_issedbooks
