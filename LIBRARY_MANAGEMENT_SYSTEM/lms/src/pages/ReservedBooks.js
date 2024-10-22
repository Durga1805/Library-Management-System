import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books');
        setBooks(response.data || []); // Ensure books is an array
        setLoading(false);
      } catch (error) {
        setError('Error fetching books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleIssueBook = async (bookId) => {
    try {
      // Assuming you update the status of the book to 'Issued' on the server
      await axios.patch(`http://localhost:8080/api/books/issue/${bookId}`, { status: 'Issued' });
      // After issuing, fetch the books again to update the list
      const response = await axios.get('http://localhost:8080/api/books');
      setBooks(response.data || []);
      alert('Book issued successfully');
    } catch (error) {
      alert('Error issuing book');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filter books to only show the ones with status 'Reserved'
  const reservedBooks = books.filter((book) => book.status === 'Reserved');
   console.log(reservedBooks)
  return (
    <div>
      <h1>Reserved Books</h1>
      {reservedBooks && reservedBooks.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Acc. No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Reserved By</th>
              <th>Reserved At</th>
              <th>Action</th> {/* Added a column for the Issue button */}
            </tr>
          </thead>
          <tbody>
            {reservedBooks.map((book) => (
              <tr key={book._id}>
                <td>{book.accno}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
               <td>{book.reservedBy ? book.reservedBy : 'N/A'}</td>
                <td>{book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => handleIssueBook(book._id)}>Issue</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No reserved books found.</div>
      )}
    </div>
  );
};

export default ReservedBooks;
