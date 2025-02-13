import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaBook } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';

const GuestBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/books/guest');
      // Group books by title and calculate copies
      const groupedBooks = response.data.reduce((acc, book) => {
        if (!acc[book.title]) {
          acc[book.title] = {
            ...book,
            copies: 1,
            availableCopies: book.status === 'Available' ? 1 : 0
          };
        } else {
          acc[book.title].copies += 1;
          if (book.status === 'Available') {
            acc[book.title].availableCopies += 1;
          }
        }
        return acc;
      }, {});
      setBooks(Object.values(groupedBooks));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.accession_no.toString().includes(searchQuery);
    const matchesDepartment = selectedDepartment === 'all' || book.dept === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-red-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">LMS</Link>
          <Link 
            to="/login" 
            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or accession number..."
                className="w-full pl-10 pr-4 py-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded px-4 py-2"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Category</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MCA">MCA</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Novel-ML">Novel-ML</option>
              <option value="Novel-EN">Novel-EN</option>
              <option value="Story-EN">Story-EN</option>
              <option value="Story-ML">Story-ML</option>
              <option value="Travelogue-ML">Travelogue-ML</option>
              <option value="Travelogue-EN">Travelogue-EN</option>
              <option value="Poem-ML">Poem-ML</option>
              <option value="Poem-EN">Poem-EN</option>
              <option value="Autobiography-ML">Autobiography-ML</option>
              <option value="Autobiography-EN">Autobiography-EN</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {book.dept}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Call No:</span> {book.call_no}</p>
                    <p><span className="font-medium">Total Copies:</span> {book.copies}</p>
                    <p><span className="font-medium">Available Copies:</span> {book.availableCopies}</p>
                    <div className="flex items-center mt-2">
                      <FaBook className="text-green-500 mr-2" />
                      <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestBooks; 