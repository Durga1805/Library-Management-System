// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaFilter, FaBook, FaBars ,FaHistory, FaUser, FaNewspaper,FaSignOutAlt} from 'react-icons/fa';
// import Header from '../components/Header';
// import axiosInstance from '../utils/axiosConfig';

// const S_ViewBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({
//     dept: 'all',
//     status: 'all'
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/api/books/all');
//       setBooks(response.data);
//       setFilteredBooks(response.data);
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
    
//     const filtered = books.filter(book => {
//       const matchesQuery = 
//         book.title.toLowerCase().includes(query) ||
//         book.author.toLowerCase().includes(query) ||
//         book.isbn.includes(query) ||
//         book.accession_no.toString().includes(query);
      
//       const matchesDept = filters.dept === 'all' || book.dept === filters.dept;
//       const matchesStatus = filters.status === 'all' || book.status === filters.status;
      
//       return matchesQuery && matchesDept && matchesStatus;
//     });
    
//     setFilteredBooks(filtered);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
    
//     const filtered = books.filter(book => {
//       const matchesQuery = 
//         book.title.toLowerCase().includes(searchQuery) ||
//         book.author.toLowerCase().includes(searchQuery) ||
//         book.isbn.includes(searchQuery) ||
//         book.accession_no.toString().includes(searchQuery);
      
//       const matchesDept = (name === 'dept' ? value : filters.dept) === 'all' || 
//                          book.dept === (name === 'dept' ? value : filters.dept);
//       const matchesStatus = (name === 'status' ? value : filters.status) === 'all' || 
//                            book.status === (name === 'status' ? value : filters.status);
      
//       return matchesQuery && matchesDept && matchesStatus;
//     });
    
//     setFilteredBooks(filtered);
//   };

//   const handleReserve = async (bookId) => {
//     try {
//       await axiosInstance.post(`/api/books/reserve/${bookId}`);
//       fetchBooks();
//     } catch (error) {
//       console.error('Error reserving book:', error);
//       alert(error.response?.data?.message || 'Error reserving book');
//     }
//   };

//   // Add cancel reservation handler
//   const handleCancelReservation = async (bookId) => {
//     try {
//       await axiosInstance.post(`/api/books/cancel-reservation/${bookId}`);
//       fetchBooks();
//     } catch (error) {
//       console.error('Error canceling reservation:', error);
//       alert(error.response?.data?.message || 'Error canceling reservation');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 ${
//         isMenuOpen ? 'block' : 'hidden md:block'
//       }`}>
//         <h1 className="text-2xl font-bold text-center">LMS</h1>

//         <Link
//                   to="/staffpage"
//                   className="block px-4 py-2 hover:bg-gray-600"
//                 >
//                   Dashboard
//                 </Link>

//         <nav className="flex flex-col space-y-3">
//           {/* Books Dropdown */}
//           <div className="relative">
//             <button
//               className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
//               onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
//             >
//               <span className="flex items-center">
//                 <FaBook className="mr-2" />
//                 Books
//               </span>
//               <FaBars />
//             </button>
//             {isBooksDropdownOpen && (
//               <div className="mt-2 py-2 bg-gray-700 rounded-md">
//                 <Link
//                   to="/viewbooks"
//                   className="block px-4 py-2 hover:bg-gray-600"
//                 >
//                   View Books
//                 </Link>
               
//               </div>
//             )}
//           </div>

//           {/* Profile Settings */}
//           <Link
//             to="/staffprofile"
//             className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
//           >
//             <FaUser className="mr-2" />
//             Profile Settings
//           </Link>

//           {/* Borrowed Books */}
//           <Link
//             to="/my-books-details"
//             className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
//           >
//             <FaHistory className="mr-2" />
//             My Borrowed Books
//           </Link>

//           <Link
//             to="/lending-archives"
//             className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
//           >
//             <FaHistory className="mr-2" />
//             Lending Archives
//           </Link>
//           <Link
//             to="/staffnewspaper"
//             className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
//           >
//             <FaNewspaper className="mr-2" />
//             Newspapers
//           </Link>
         
//         </nav>
//       </aside>

      

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header title="View Books" />

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <FaBars />
//         </button>

//         {/* Search and Filters */}
//         <div className="p-4 bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-wrap gap-4 items-center">
//               {/* Search Bar */}
//               <div className="flex-1 min-w-[300px]">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search by title, author, ISBN, or accession number..."
//                     value={searchQuery}
//                     onChange={handleSearch}
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg"
//                   />
//                   <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                 </div>
//               </div>

//               {/* Filter Toggle Button */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//               >
//                 <FaFilter />
//                 Filters
//               </button>
//             </div>

//             {/* Filter Options */}
//             {showFilters && (
//               <div className="mt-4 flex flex-wrap gap-4">
//                 <select
//                   name="dept"
//                   value={filters.dept}
//                   onChange={handleFilterChange}
//                   className="border rounded-lg px-4 py-2"
//                 >
//                   <option value="all">All Category</option>
//                 <option value="CSE">CSE</option>
//                 <option value="IT">IT</option>
//                 <option value="MCA">MCA</option>
//                 <option value="Mathematics">Mathematics</option>
//                 <option value="Novel-ML">Novel-ML</option>
//                 <option value="Novel-EN">Novel-EN</option>
//                 <option value="Story-EN">Story-EN</option>
//                 <option value="Story-ML">Story-ML</option>
//                 <option value="Travelogue-ML">Travelogue-ML</option>
//                 <option value="Travelogue-EN">Travelogue-EN</option>
//                 <option value="Poem-ML">Poem-ML</option>
//                 <option value="Poem-EN">Poem-EN</option>
//                 <option value="Autobiography-ML">Autobiography-ML</option>
//                 <option value="Autobiography-EN">Autobiography-EN</option>
//                 </select>

//                 <select
//                   name="status"
//                   value={filters.status}
//                   onChange={handleFilterChange}
//                   className="border rounded-lg px-4 py-2"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Active">Available</option>
//                   <option value="Issued">Issued</option>
//                   <option value="Reserved">Reserved</option>
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Books List */}
//         <div className="flex-1 p-4 overflow-auto">
//           {loading ? (
//             <div className="flex justify-center items-center h-full">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//           ) : (
//             <div className="max-w-7xl mx-auto">
//               {filteredBooks.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   No books found matching your criteria
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredBooks.map((book) => (
//                     <div key={book._id} className="bg-white rounded-lg shadow-md p-6">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
//                           <p className="text-gray-600 mb-1">By {book.author}</p>
//                           <p className="text-sm text-gray-500 mb-1">ISBN: {book.isbn}</p>
//                           <p className="text-sm text-gray-500 mb-1">Call No: {book.call_no}</p>
//                           <p className="text-sm text-gray-500 mb-1">Accession No: {book.accession_no}</p>
//                           <p className="text-sm text-gray-500 mb-1">Category: {book.dept}</p>
//                           <p className="text-sm text-gray-500 mb-1">Publisher: {book.publisher}</p>
//                           <p className="text-sm text-gray-500 mb-1">Year: {book.year_of_publication}</p>
//                           <p className="text-sm text-gray-500 mb-1">Pages: {book.no_of_pages}</p>
//                           <p className="text-sm text-gray-500">Price: ₹{book.price}</p>
//                         </div>
//                         <div className="flex flex-col items-end space-y-2">
//                           <span className={`px-2 py-1 rounded text-sm ${
//                             book.status === 'Available' ? 'bg-green-100 text-green-800' :
//                             book.status === 'Issued' ? 'bg-red-100 text-red-800' :
//                             'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {book.status}
//                           </span>
//                           {book.status === 'Available' && (
//                             <button
//                               onClick={() => handleReserve(book._id)}
//                               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//                             >
//                               Reserve
//                             </button>
//                           )}
//                           {book.status === 'Reserved' && book.reservedBy === localStorage.getItem('userId') && (
//                             <button
//                               onClick={() => handleCancelReservation(book._id)}
//                               className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                             >
//                               Cancel Reservation
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default S_ViewBooks; 



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaBook, FaBars ,FaHistory, FaUser, FaNewspaper,FaSignOutAlt} from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';

const S_ViewBooks = () => {
const [books, setBooks] = useState([]);
const [groupedBooks, setGroupedBooks] = useState({});
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [selectedBook, setSelectedBook] = useState(null);
const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

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
      <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 ${
        isMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link
                  to="/staffpage"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Dashboard
                </Link>

        <nav className="flex flex-col space-y-3">
          {/* Books Dropdown */}
          <div className="relative">
            <button
              className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="mt-2 py-2 bg-gray-700 rounded-md">
                <Link
                  to="/viewbooks"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  View Books
                </Link>
               
              </div>
            )}
          </div>

          {/* Profile Settings */}
          <Link
            to="/staffprofile"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>

          {/* Borrowed Books */}
          <Link
            to="/my-books-details"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          <Link
            to="/lending-archives"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Lending Archives
          </Link>
          <Link
            to="/staffnewspaper"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspapers
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
export default S_ViewBooks; 