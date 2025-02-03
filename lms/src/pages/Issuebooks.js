import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function Issuebooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fine, setFine] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books');
        setBooks(response.data || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching books');
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Handle return book
  const handleReturnBook = async (bookId) => {
    try {
      const fineResponse = await axios.get(`http://localhost:8080/api/return/${bookId}`);
      setFine(fineResponse.data.fine);
      setSelectedBook(bookId);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching fine:', error);
      alert('Error processing book return');
    }
  };

  const confirmReturn = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/return/${selectedBook}/confirm`, {
        paymentSuccess: fine === 0 ? true : false, 
      });
      alert(response.data.message);
      setShowModal(false);
      setBooks(books.map((book) => (book._id === selectedBook ? { ...book, status: 'Active' } : book)));
    } catch (error) {
      console.error('Error confirming return:', error);
      alert('Error processing book return');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFine(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const issuedBooks = books.filter((book) => book.status === 'Issued');

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={() => navigate('/')} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Issued Books</h1>
        {issuedBooks.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg" border="1" cellPadding="10" cellSpacing="0">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Reserved By</th>
                <th className="px-4 py-2">Issued At</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book) => (
                <tr key={book._id} className="text-gray-700">
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.reservedBy || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {book.issuedAt ? new Date(book.issuedAt).toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true,
                    }) : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {book.dueDate ? new Date(book.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit'
                    }) : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleReturnBook(book._id)}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
            <h2 className="text-lg font-bold mb-4">Confirm Return</h2>
            {fine > 0 ? (
              <>
                <p className="text-red-600 font-bold mb-2">Fine: Rs {fine}</p>
                <p>To return this book, please proceed with the payment.</p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-4"
                  onClick={confirmReturn}
                >
                  Pay & Return
                </button>
              </>
            ) : (
              <>
                <p>No fine. Do you want to confirm the return?</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
                  onClick={confirmReturn}
                >
                  Confirm Return
                </button>
              </>
            )}
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full mt-2"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issuebooks;
