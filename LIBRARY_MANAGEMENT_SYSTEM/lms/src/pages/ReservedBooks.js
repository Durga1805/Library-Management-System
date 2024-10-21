import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservedBooks = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For logout navigation

  // Function to fetch reserved books from the API
  const fetchReservedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/reserved'); // Ensure this is correct
      setReservedBooks(response.data);
    } catch (error) {
      console.error('Error fetching reserved books:', error);
      // Handle error or notify user here if necessary
    } finally {
      setLoading(false);
    }
  };

  // Fetch reserved books when component mounts
  useEffect(() => {
    fetchReservedBooks();
  }, []);

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
              <p>Reserved by: {book.reservedBy} ({book.role})</p>
              <p>Reserved at: {new Date(book.reservedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservedBooks;
