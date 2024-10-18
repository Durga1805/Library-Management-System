import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation on logout

const ReservedBooks = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For logout navigation

  // Function to fetch reserved books from the API
  const fetchReservedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/books/reserved');
      setReservedBooks(response.data);
    } catch (error) {
      console.error('Error fetching reserved books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reserved books when component mounts
  useEffect(() => {
    fetchReservedBooks();
  }, []);

  // Function to reserve a book
  const reserveBook = async (bookId) => {
    try {
      const userId = 'YOUR_USER_ID'; // Replace with actual logic for fetching user ID
      const userType = 'student'; // Example, replace with actual logic based on user session

      const response = await axios.post(`http://localhost:8080/api/books/${bookId}/reserve`, {
        userId,
        userType
      });

      alert('Book reserved successfully');
      fetchReservedBooks(); // Refresh the reserved books list
    } catch (error) {
      alert('Error reserving book');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Reserved Books</h2>
      {loading ? (
        <p>Loading reserved books...</p>
      ) : (
        <ul>
          {reservedBooks.map((book) => (
            <li key={book._id}>
              <h4>{book.title}</h4>
              <p>Reserved by: {book.reservedByStudent ? 'Student' : 'Staff'}</p>
              <button onClick={() => reserveBook(book._id)}>Reserve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservedBooks;
