import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/user.jpg';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('name') || 'User';
  const [reserveLoading, setReserveLoading] = useState('');
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchType = params.get('type');
  const searchQuery = params.get('query');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/books/search`, {
          params: { type: searchType, query: searchQuery },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data.length === 0) {
          setError('No results found for your query.');
        } else {
          const filteredResults = response.data.filter(
            (book) => book.status === 'Active' || (book.status === 'Reserved' && book.reservedBy === userId)
          );
          setResults(filteredResults);

          if (filteredResults.length === 0) {
            setError('No active  books available for you.');
          }
        }
      } catch (error) {
        setError('Error fetching search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (searchType && searchQuery) {
      fetchResults();
    } else {
      setLoading(false);
      setError('Search type or query is missing.');
    }
  }, [searchType, searchQuery, userId]);

  const handleReserve = async (bookId) => {
    try {
      setReserveLoading(bookId);
      const response = await axios.post(
        `http://localhost:8080/api/books/${bookId}/reserve`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        setResults((prevResults) =>
          prevResults.map((book) =>
            book._id === bookId ? { ...book, status: 'Reserved', reservedBy: userId } : book
          )
        );
      }
    } catch (error) {
      setError('Error reserving the book. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  const handleCancel = async (bookId) => {
    try {
      setReserveLoading(bookId);
      const response = await axios.post(
        `http://localhost:8080/api/books/${bookId}/cancel`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        setResults((prevResults) =>
          prevResults.map((book) =>
            book._id === bookId ? { ...book, status: 'Active', reservedBy: null } : book
          )
        );
      }
    } catch (error) {
      setError('Error canceling the reservation. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      return sortConfig.direction === 'asc' ? (valueA < valueB ? -1 : 1) : (valueA > valueB ? -1 : 1);
    }
    return 0;
  });
  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId from local storage
    localStorage.removeItem('profilePic'); // Clear profilePic if desired
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Header */}
        <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
          <div className="h-full container mx-auto flex items-center px-4 justify-between">
            <button onClick={() => navigate('/userch')} className="text-white hover:text-gray-200 mr-4">&larr; Back</button>
            <h1 className="text-white text-xl font-bold">LMS</h1>
            <nav className="flex space-x-4 items-center">
              <h6 className="text-white hover:text-gray-200">{name}</h6>
              <div className="relative" ref={dropdownRef}>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                  <span className="text-white">P</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <ul>
                      {/* <li><Link to="/edit-staff-details" className="block px-4 py-2 text-black hover:bg-gray-200">Edit Profile</Link></li> */}
                      {/* <li><Link to="/view-profile" className="block px-4 py-2 text-black hover:bg-gray-200">View Profile</Link></li> */}
                      <li><button onClick={() => handleLogout()} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200">Logout</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>

        {/* Search Results */}
        <div className="container mx-auto py-10 max-w-screen-lg">
          <h1 className="text-4xl font-bold mb-6 text-white text-center">Search Results</h1>
          {results.length === 0 ? (
            <h1 className="text-center text-white text-xl">{error}</h1>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('title')}>Title</th>
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('author')}>Author</th>
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('status')}>Status</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((book) => (
                    <tr key={book._id} className="border-b">
                      <td className="py-4 px-6">{book.title}</td>
                      <td className="py-4 px-6">{book.author}</td>
                      <td className="py-4 px-6">{book.status}</td>
                      <td className="py-4 px-6 text-center">
                        {book.status === 'Active' && (
                          <button onClick={() => handleReserve(book._id)} disabled={reserveLoading === book._id} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                            {reserveLoading === book._id ? 'Reserving...' : 'Reserve'}
                          </button>
                        )}
                        {book.status === 'Reserved' && book.reservedBy === userId && (
                          <button onClick={() => handleCancel(book._id)} disabled={reserveLoading === book._id} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
                            {reserveLoading === book._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
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

export default SearchResults;
