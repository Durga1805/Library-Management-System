import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg'; // Adjust the path accordingly

function ListBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'accno', direction: 'ascending' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://library-management-system-backend-4gdn.onrender.com/api/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Sort logic, only for 'accno', 'author', and 'title'
  const sortBooks = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    navigate('/'); // Redirects to the login page
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="container mx-auto p-4 mt-16">
          <h1 className="text-4xl font-bold mb-4 text-white">List of Books</h1>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortBooks('accno')}>
                  Accession No {sortConfig.key === 'accno' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2">Call No</th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortBooks('title')}>
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2">Year of Publication</th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortBooks('author')}>
                  Author {sortConfig.key === 'author' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2">Publisher</th>
                <th className="border px-4 py-2">ISBN</th>
                <th className="border px-4 py-2">No of Pages</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Cover Type</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((book) => (
                <tr key={book._id}>
                  <td className="border px-4 py-2">{book.accno}</td>
                  <td className="border px-4 py-2">{book.call_no}</td>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.year_of_publication}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.publisher}</td>
                  <td className="border px-4 py-2">{book.isbn}</td>
                  <td className="border px-4 py-2">{book.no_of_pages}</td>
                  <td className="border px-4 py-2">{book.price}</td>
                  <td className="border px-4 py-2">{book.dept}</td>
                  <td className="border px-4 py-2">{book.cover_type}</td>
                  <td className="border px-4 py-2">{book.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListBooks;
