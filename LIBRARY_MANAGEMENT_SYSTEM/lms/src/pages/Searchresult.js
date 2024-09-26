import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
      try {
        const response = await axios.get(`http://localhost:8080/api/books/search`, {
          params: { type: searchType, query: searchQuery },
        });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching search results');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="container mx-auto p-6"
      style={{
        backgroundImage: `url('your-background-image-url.jpg')`, // Add your background image URL here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-white">Search Results</h1>
      {results.length === 0 ? (
        <p className="text-white">No results found for "{searchQuery}"</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-6 font-semibold text-left">Title</th>
              <th className="py-3 px-6 font-semibold text-left">Author</th>
              <th className="py-3 px-6 font-semibold text-left">Accession Number</th>
              <th className="py-3 px-6 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((book, index) => (
              <tr
                key={book._id}
                className={`${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } hover:bg-gray-300 transition duration-200`}
              >
                <td className="py-4 px-6 border-b border-gray-200">{book.title}</td>
                <td className="py-4 px-6 border-b border-gray-200">{book.author}</td>
                <td className="py-4 px-6 border-b border-gray-200">{book.accno}</td>
                <td className="py-4 px-6 border-b border-gray-200">{book.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchResults;
