import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/user.jpg';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserveLoading, setReserveLoading] = useState(''); // To track loading per book reservation
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' }); // Sorting state
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchType = params.get('type');
  const searchQuery = params.get('query');

 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/');
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://library-management-system-backend-4gdn.onrender.com/api/books/search', {
          params: { type: searchType, query: searchQuery },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data.length === 0) {
          setError('No results found for your query.');
        } else {
          // Filter out books with status 'Issued'
          const filteredResults = response.data.filter((book) => book.status !== 'Issued');
          setResults(filteredResults);

          if (filteredResults.length === 0) {
            setError('No available books found.');
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

  const handleReserve = async (bookId) => {
    const userId = localStorage.getItem('userId');
    try {
      setReserveLoading(bookId);
      const response = await axios.post(`http://localhost:8080/api/books/${bookId}/reserve`, { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.status === 200) {
        setResults((prevResults) =>
          prevResults.map((book) =>
            book._id === bookId ? { ...book, status: 'Reserved' } : book
          )
        );
      }
    } catch (error) {
      setError('Error reserving the book. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  const handleCancelReservation = async (bookId) => {
    const userId = localStorage.getItem('userId');
    try {
      setReserveLoading(bookId);
      const response = await axios.post(`http://localhost:8080/api/books/${bookId}/cancel`, { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.status === 200) {
        setResults((prevResults) =>
          prevResults.map((book) =>
            book._id === bookId ? { ...book, status: 'Available' } : book
          )
        );
      }
    } catch (error) {
      setError('Error canceling the reservation. Please try again.');
    } finally {
      setReserveLoading('');
    }
  };

  // Sorting logic
  const sortResults = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <div className="text-white text-center text-2xl mt-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center text-2xl mt-6">{error}</div>;

  const handleBack = () => {
    navigate('/userpage'); // Navigate to the previous page
  };


  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <button 
          onClick={handleBack} 
          className="text-white hover:text-gray-200 mr-4"
        >
          &larr; Back
        </button>
        <h1 className="text-white text-xl font-bold">LMS</h1>
       
            
            
            <button onClick={handleLogout} className="text-white hover:text-gray-300" aria-label="Logout">Logout</button>
         
        </div>
      </header>

      <div className="container mx-auto py-20 max-w-screen-lg">
        <h1 className="text-4xl font-bold mb-9 text-white text-center">Search Results</h1>
        {results.length === 0 ? (
          <p className="text-center text-red-500 text-xl">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left">Acc No</th>
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('title')}>
                    Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortResults('author')}>
                    Author {sortConfig.key === 'author' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-100">
                    <td className="py-3 px-6">{book.accno}</td>
                    <td className="py-3 px-6">{book.title}</td>
                    <td className="py-3 px-6">{book.author}</td>
                    <td className="py-3 px-6">{book.status}</td>
                    <td className="py-3 px-6 text-center">
                      {book.status === 'Deactive' ? (
                        <span className="text-gray-500">Unavailable</span>
                      ) : book.status === 'Reserved' ? (
                        <button
                          onClick={() => handleCancelReservation(book._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          disabled={reserveLoading === book._id}
                        >
                          {reserveLoading === book._id ? 'Canceling...' : 'Cancel'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReserve(book._id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          disabled={reserveLoading === book._id}
                        >
                          {reserveLoading === book._id ? 'Reserving...' : 'Reserve'}
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
  );
};

export default SearchResults;
