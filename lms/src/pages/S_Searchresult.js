import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/Staff.jpg';

const S_Searchresult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    setTimeout(preventBack, 0);
    window.onunload = function () {
      return null;
    };
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/');
  };

  // Toggle profile dropdown
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle back navigation
  const handleBack = () => {
    navigate('/staffpage'); // Go back to the previous page
  };

  // Fetch search results based on query
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
            (book) => book.status === 'Active' || book.status === 'Deactive'
          );
          setResults(filteredResults);

          if (filteredResults.length === 0) {
            setError('No active or deactive books found.');
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
  }, [searchType, searchQuery]);

  // Function to handle reserving a book
  const handleReserve = async (bookId) => {
    const userId = localStorage.getItem('userId');

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
            book._id === bookId ? { ...book, status: 'Reserved' } : book
          )
        );
        console.log('Book reserved successfully');
      }
    } catch (error) {
      console.error('Error reserving the book:', error);
      setError('Error reserving the book. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  // Function to handle canceling a reservation
  const handleCancel = async (bookId) => {
    const userId = localStorage.getItem('userId');

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
            book._id === bookId ? { ...book, status: 'Active' } : book
          )
        );
        console.log('Reservation canceled successfully');
      }
    } catch (error) {
      console.error('Error canceling the reservation:', error);
      setError('Error canceling the reservation. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  // Sorting logic
  const sortResults = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  if (loading) return <div className="text-white text-center text-2xl mt-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center text-2xl mt-6">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
          <div className="h-full container mx-auto flex items-center px-4 justify-between">
            <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
              &larr; Back
            </button>
            <h1 className="text-white text-xl font-bold">LMS</h1>
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <span className="text-white">P</span>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul>
                    {/* <li>
                      <Link
                        to="/edit-staff-details"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/s_view-profile"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        View Profile
                      </Link>
                    </li> */}
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

        <div className="container mx-auto py-10 max-w-screen-lg">
          <h1 className="text-4xl font-bold mb-6 text-white text-center">Search Results</h1>
          {results.length === 0 ? (
            <p className="text-center text-red-500 text-xl">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('title')}>
                      Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('author')}>
                      Author {sortConfig.key === 'author' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="py-3 px-6 text-left">Publisher</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((book) => (
                    <tr key={book._id} className="border-b">
                      
                      <td className="py-3 px-6">{book.title}</td>
                      <td className="py-3 px-6">{book.author}</td>
                      <td className="py-3 px-6">{book.publisher}</td>
                      <td className="py-3 px-6">{book.status}</td>
                      <td className="py-3 px-6">
                        {book.status === 'Active' ? (
                          <button
                            onClick={() => handleReserve(book._id)}
                            disabled={reserveLoading === book._id}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                          >
                            {reserveLoading === book._id ? 'Reserving...' : 'Reserve'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCancel(book._id)}
                            disabled={reserveLoading === book._id}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                          >
                            {reserveLoading === book._id ? 'Canceling...' : 'Cancel'}
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

export default S_Searchresult;
