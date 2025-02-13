// lms\src\components\BookRecommendations.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { FaBook, FaSpinner, FaBookmark } from 'react-icons/fa';

const BookRecommendations = () => {
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
      const response = await axiosInstance.get('/api/books/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (bookId) => {
    try {
      setReservingBook(bookId);
      await axiosInstance.post(`/api/books/reserve/${bookId}`);
      // Update recommendations after reservation
      fetchRecommendations();
    } catch (error) {
      console.error('Error reserving book:', error);
      alert('Failed to reserve book. Please try again.');
    } finally {
      setReservingBook(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
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

  if (recommendations.length === 0) {
    return null; // Don't show the component if no recommendations
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
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
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaBook className="text-2xl text-blue-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-gray-500 text-sm mb-3">{book.dept}</p>
                  <button
                    onClick={() => handleReserve(book._id)}
                    disabled={reservingBook === book._id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white 
                      ${reservingBook === book._id 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    {reservingBook === book._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaBookmark />
                    )}
                    <span>{reservingBook === book._id ? 'Reserving...' : 'Reserve Book'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookRecommendations; 