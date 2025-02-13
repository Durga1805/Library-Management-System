import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBook, FaHistory, FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [groupedBooks, setGroupedBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/books/all');

      // Group books by title
      const grouped = response.data.reduce((acc, book) => {
        if (!acc[book.title]) {
          acc[book.title] = { 
            ...book, 
            availableCount: book.status === 'Available' ? 1 : 0, 
            totalCount: 1 
          };
        } else {
          acc[book.title].totalCount += 1;
          if (book.status === 'Available') {
            acc[book.title].availableCount += 1;
          }
        }
        return acc;
      }, {});

      setBooks(response.data);
      setGroupedBooks(grouped);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (title) => {
    setSelectedBook(groupedBooks[title]);
  };

  const handleReserve = async (title) => {
    const bookToReserve = books.find(book => book.title === title && book.status === 'Available');

    if (!bookToReserve) {
      alert('No available copies to reserve.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/books/reserve/${bookToReserve._id}`);
      alert(response.data.message);

      // Update availability
      setGroupedBooks(prev => ({
        ...prev,
        [title]: {
          ...prev[title],
          availableCount: prev[title].availableCount - 1
        }
      }));

      fetchBooks();
    } catch (error) {
      console.error('Error reserving book:', error);
      alert(error.response?.data?.message || 'Error reserving book');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
          <Link to="/userpage" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaBook className="mr-2" /> Dashboard
          </Link>
          <Link to="/view-books" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaBook className="mr-2" /> View Books
          </Link>
          <Link to="/my-borrowed-books" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaHistory className="mr-2" /> My Borrowed Books
          </Link>
          <Link to="/studentprofile" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaUser className="mr-2" /> Profile Settings
          </Link>
          <Link to="/my-history" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaHistory className="mr-2" /> My History
          </Link>
          <Link to="/student-newspaper" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center">
            <FaHistory className="mr-2" /> Newspaper
          </Link>
          <Link 
            to="/book-request" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Request Book
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="View Books" />

        {/* Search Bar */}
        <div className="p-4 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="flex-1 p-4 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(groupedBooks)
                  .filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((book) => (
                    <div 
                      key={book.title} 
                      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg relative"
                      onClick={() => handleBookClick(book.title)}
                    >
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-gray-600">By {book.author}</p>
                      <p className="text-sm text-gray-500">Total Copies: {book.totalCount}</p>
                      <p className="text-sm text-gray-500">Available: {book.availableCount}</p>

                      {book.availableCount === 0 ? (
                        <p className="text-red-500 font-semibold mt-2">Out of Stock</p>
                      ) : book.availableCount < 2 ? (
                        <p className="text-orange-500 font-semibold mt-2">⚠️ Limited Stock Available!</p>
                      ) : (
                        <p className="text-green-500 font-semibold mt-2">✅ Available</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Book Details */}
        {selectedBook && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold">{selectedBook.title}</h2>
              <p className="text-gray-600">By {selectedBook.author}</p>
              <p className="text-sm text-gray-500">Total Copies: {selectedBook.totalCount}</p>
              <p className="text-sm text-gray-500">Available: {selectedBook.availableCount}</p>

              {selectedBook.availableCount > 0 ? (
                <button
                  onClick={() => handleReserve(selectedBook.title)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reserve
                </button>
              ) : (
                <p className="text-red-500 mt-4">No copies available</p>
              )}

              <button
                onClick={() => setSelectedBook(null)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBooks;
