import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaBook, FaUsers, FaUserCircle, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Header from '../components/Header';

const SearchAndListBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    dept: 'all',
    status: 'all'
  });
  const [distinctBooks, setDistinctBooks] = useState([]);
  const [expandedBooks, setExpandedBooks] = useState({});
  const [selectedDept, setSelectedDept] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedDept]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log('Fetching books with:', { searchQuery, selectedDept }); // Debug log

      const response = await axios.get('http://localhost:8080/api/books/all', {
        params: {
          search: searchQuery,
          dept: selectedDept
        }
      });

      console.log('Search response:', response.data); // Debug log
      setBooks(response.data);
      
      // Group books by ISBN
      const groupedBooks = response.data.reduce((acc, book) => {
        if (!acc[book.isbn]) {
          acc[book.isbn] = {
            ...book,
            copies: [book],
            totalCopies: 1
          };
        } else {
          acc[book.isbn].copies.push(book);
          acc[book.isbn].totalCopies += 1;
        }
        return acc;
      }, {});

      setDistinctBooks(Object.values(groupedBooks));
      setFilteredBooks(Object.values(groupedBooks));
    } catch (error) {
      console.error('Error fetching books:', error);
      setMessage('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = distinctBooks.filter(book => {
      const matchesQuery = 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query);
      const matchesDept = filters.dept === 'all' || book.dept === filters.dept;
      
      return matchesQuery && matchesDept;
    });
    
    setFilteredBooks(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    const filtered = books.filter(book => {
      const matchesQuery = Object.values(book).some(value => 
        String(value).toLowerCase().includes(searchQuery)
      );
      const matchesDept = (name === 'dept' ? value : filters.dept) === 'all' || 
                         book.dept === (name === 'dept' ? value : filters.dept);
      const matchesStatus = (name === 'status' ? value : filters.status) === 'all' || 
                          book.status === (name === 'status' ? value : filters.status);
      
      return matchesQuery && matchesDept && matchesStatus;
    });
    
    setFilteredBooks(filtered);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleBookDetails = (isbn) => {
    setExpandedBooks(prev => ({
      ...prev,
      [isbn]: !prev[isbn]
    }));
  };

  return (
    <div className="flex h-screen">
        <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link 
            to="/libstaffpage" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Dashboard
          </Link>
        <nav className="flex flex-col space-y-3">
          {/* Manage Books Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between w-full"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Manage Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/addbooks" className="block px-4 py-2 hover:bg-gray-600">Add Books</Link>
                <Link to="/search-list-books" className="block px-4 py-2 hover:bg-gray-600">Search & List Books</Link>
                <Link to="/issue-books" className="block px-4 py-2 hover:bg-gray-600">Issue Books</Link>
                
              </div>
            )}
          </div>

          {/* Manage Users Dropdown */}
          <Link 
            to="/users" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Manage Users
          </Link>

          {/* Reports & Analytics */}
          <Link 
            to="/reports" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Reports & Analytics
          </Link>

          {/* Profile Settings */}
          <Link 
            to="/profile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Profile Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Search & List Books" />

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Book Catalog</h2>

            {message && (
              <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                {message}
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <select
                name="dept"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setFilters(prev => ({ ...prev, dept: e.target.value }));
                }}
                className="border rounded-lg px-3 py-2"
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

            {/* Books List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-4">No books found</div>
              ) : (
                filteredBooks.map((book) => (
                  <div key={book.isbn} className="border rounded-lg overflow-hidden">
                    {/* Book Header */}
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleBookDetails(book.isbn)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <div className="text-sm text-gray-600">
                          <span>By {book.author}</span>
                          <span className="mx-2">•</span>
                          <span>ISBN: {book.isbn}</span>
                          <span className="mx-2">•</span>
                          <span>{book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}</span>
                        </div>
                      </div>
                      {expandedBooks[book.isbn] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    {/* Expanded Details */}
                    {expandedBooks[book.isbn] && (
                      <div className="p-4 border-t">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left">Accession No</th>
                              <th className="px-4 py-2 text-left">Call No</th>
                              <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {book.copies.map((copy) => (
                              <tr key={copy.accession_no} className="border-t">
                                <td className="px-4 py-2">{copy.accession_no}</td>
                                <td className="px-4 py-2">{copy.call_no}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded text-sm ${
                                    copy.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    copy.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                                    copy.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {copy.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchAndListBooks; 