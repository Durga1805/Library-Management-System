// LIBRARY_MANAGEMENT_SYSTEM\lms\src\pages\Searchresult.js
import axios from 'axios';
import React, { useEffect, useState } from 'react'; 
import { useLocation, Link } from 'react-router-dom';
import backgroundImage from '../assets/user.jpg';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchType = params.get('type');
  const searchQuery = params.get('query');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true); // Set loading state at the start of fetching
      try {
        const response = await axios.get(`http://localhost:8080/api/books/search`, {
          params: { type: searchType, query: searchQuery },
        });

        if (response.data.length === 0) {
          setError('No results found for your query.');
        } else {
          setResults(response.data);
        }
      } catch (error) {
        setError('Error fetching search results. Please try again later.');
      } finally {
        setLoading(false); // Always set loading to false at the end
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
    try {
      const response = await axios.post(`http://localhost:8080/api/books/${bookId}/reserve`);
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
    }
  };

  if (loading) return <div className="text-white text-center text-2xl mt-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center text-2xl mt-6">{error}</div>;

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <header className="bg-blue-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Library Management System</h1>
          <nav className="flex space-x-4">
            <Link to="/userpage" className="text-white hover:text-gray-300">Back</Link>
            <button onClick={() => console.log('Logged out')} className="text-white hover:text-gray-300" aria-label="Logout">Logout</button>
          </nav>
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
                  <th className="py-3 px-6 font-semibold text-left">Accession Number</th>
                  <th className="py-3 px-6 font-semibold text-left">Title</th>
                  <th className="py-3 px-6 font-semibold text-left">Author</th>
                  <th className="py-3 px-6 font-semibold text-left">Status</th>
                  <th className="py-3 px-6 font-semibold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((book, index) => (
                  <tr key={book._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-300 transition duration-200`}>
                    <td className="py-4 px-6 border-b border-gray-200">{book.accno}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{book.title}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{book.author}</td>
                    <td className={`py-4 px-6 border-b border-gray-200 ${book.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{book.status}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {book.status === 'Active' ? (
                        <button onClick={() => handleReserve(book._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ease-in-out duration-200">
                          Reserve
                        </button>
                      ) : (
                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" aria-label="Unavailable">
                          Unavailable
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
