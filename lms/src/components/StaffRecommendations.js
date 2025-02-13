import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { FaBook, FaSpinner, FaBookmark } from 'react-icons/fa';

const StaffRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingBook, setReservingBook] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/books/recommendations');
      console.log('Recommendations response:', response.data);
      
      if (!response.data || response.data.length === 0) {
        setError('No recommendations available at this time');
        setRecommendations([]);
      } else {
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.response?.data?.message || 'Error fetching recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (bookId) => {
    try {
      setReservingBook(bookId);
      await axiosInstance.post(`/api/books/reserve/${bookId}`);
      fetchRecommendations(); // Refresh recommendations
    } catch (error) {
      console.error('Error reserving book:', error);
      alert(error.response?.data?.message || 'Error reserving book');
    } finally {
      setReservingBook(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Recommended for You
      </h2>
      <div className="overflow-y-auto scrollbar-container" style={{ maxHeight: '500px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          {recommendations.map((book) => (
            <div 
              key={book._id} 
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {book.dept}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Call No:</span> {book.call_no}</p>
                <p><span className="font-medium">Accession No:</span> {book.accession_no}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleReserve(book._id)}
                  disabled={reservingBook === book._id}
                  className={`flex items-center px-4 py-2 rounded ${
                    reservingBook === book._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  {reservingBook === book._id ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaBookmark className="mr-2" />
                  )}
                  {reservingBook === book._id ? 'Reserving...' : 'Reserve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffRecommendations; 