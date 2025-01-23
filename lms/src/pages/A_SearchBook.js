import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/lms2.jpg';

const A_SearchBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('title'); // default sort field
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get(`http://localhost:8080/api/books/search?type=title&query=${searchTerm}`);
      if (response.data.length > 0) {
        setBooks(response.data);
      } else {
        setBooks([]);
        setMessage('No books found with the provided title.');
      }
    } catch (error) {
      console.error('Search Error:', error);
      setMessage('Error occurred while searching for books.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (bookId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Deactive' : 'Active';
      await axios.put(`http://localhost:8080/api/books/${bookId}/status`, { status: newStatus });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, status: newStatus } : book
        )
      );
    } catch (error) {
      console.error('Error updating book status:', error);
      setMessage('Error updating book status.');
    }
  };

  // Function to handle sorting
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  // Sort books based on selected field and order
  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
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

      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Search Books</h2>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter book title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {message && <p className="text-red-500 text-center mb-4">{message}</p>}

          {sortedBooks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    {['accno', 'call_no', 'title', 'author', 'year_of_publication', 'publisher', 'isbn', 'no_of_pages', 'price', 'dept', 'cover_type', 'status'].map(field => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600 cursor-pointer"
                      >
                        {field.replace('_', ' ').toUpperCase()} {sortField === field && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                    ))}
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBooks.map((book) => (
                    <tr key={book._id}>
                      <td className="py-2 px-4 border-b">{book.accno}</td>
                      <td className="py-2 px-4 border-b">{book.call_no}</td>
                      <td className="py-2 px-4 border-b">{book.title}</td>
                      <td className="py-2 px-4 border-b">{book.author}</td>
                      <td className="py-2 px-4 border-b">{book.year_of_publication}</td>
                      <td className="py-2 px-4 border-b">{book.publisher}</td>
                      <td className="py-2 px-4 border-b">{book.isbn}</td>
                      <td className="py-2 px-4 border-b">{book.no_of_pages}</td>
                      <td className="py-2 px-4 border-b">{book.price}</td>
                      <td className="py-2 px-4 border-b">{book.dept}</td>
                      <td className="py-2 px-4 border-b">{book.cover_type}</td>
                      <td className="py-2 px-4 border-b">{book.status}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => toggleStatus(book._id, book.status)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {book.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default A_SearchBook;
