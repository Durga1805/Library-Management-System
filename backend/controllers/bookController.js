const Book = require('../models/Book');
const User = require('../models/User');
const Staff = require('../models/Staff');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');

// Function to upload books from a CSV file
const uploadBooksCSV = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      if (data.accno && data.title && data.author && data.status) {
        results.push({
          accno: data.accno,
          call_no: data.call_no || '',
          title: data.title,
          year_of_publication: Number(data.year_of_publication) || null,
          author: data.author,
          publisher: data.publisher || '',
          isbn: data.isbn || '',
          no_of_pages: Number(data.no_of_pages) || null,
          price: Number(data.price) || null,
          dept: data.dept || '',
          cover_type: data.cover_type || '',
          status: data.status,
        });
      }
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path);
      try {
        if (results.length > 0) {
          await Book.insertMany(results);
          res.status(200).json({ message: 'Books uploaded successfully!' });
        } else {
          res.status(400).json({ message: 'No valid data in the CSV file.' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error uploading books', error: error.message });
      }
    });
};

// Function to list all books
const listBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Function to search books
const searchBooks = async (req, res) => {
  const { type, query } = req.query;
  const searchCriteria = {};
  searchCriteria[type] = { $regex: query, $options: 'i' }; // Case-insensitive search

  try {
    const books = await Book.find(searchCriteria);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for books', error: error.message });
  }
};

// Function to update the status of a book
const updateBookStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['Active', 'Deactive', 'Reserved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Active, Deactive, or Reserved.' });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json({ message: 'Book status updated successfully.', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book status', error: error.message });
  }
};

// Function to reserve a book
const reserveBook = async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status === 'Reserved') {
      return res.status(400).json({ message: 'Book already reserved' });
    }

    let user = await User.findOne({ userid: userId });
    if (!user) {
      user = await Staff.findOne({ userid: userId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    book.status = 'Reserved';
    book.reservedBy = user.name;
    book.reserved = userId;
    book.reservedAt = new Date();
    await book.save();

    user.reservedBooks.push({ bookId: book._id, reservedAt: new Date() });
    await user.save();

    res.status(200).json({ message: 'Book reserved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving the book', error: error.message });
  }
};

// Function to cancel reservation
const cancelReservation = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'Reserved') {
      return res.status(400).json({ message: 'Book is not currently reserved' });
    }

    book.status = 'Active';
    book.reservedBy = null;
    book.reservedAt = null;
    await book.save();

    res.status(200).json({ message: 'Reservation canceled and book is now active.' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling the reservation', error: error.message });
  }
};

// Issue a book and calculate due date
const issueBook = async (req, res) => {
  const { id } = req.params;

  const currentDate = new Date();
  const dueDate = new Date(currentDate);
  dueDate.setDate(currentDate.getDate() + 15);

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        status: 'Issued',
        issuedAt: new Date(),
        dueDate: dueDate,
        fine: 0
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json({ message: 'Book issued successfully.', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error issuing book', error: error.message });
  }
};

// Return a book and calculate fine if overdue
// Return a book and calculate fine if overdue
const handleReturnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const currentDate = new Date();
    const dueDate = new Date(book.dueDate);
    let fine = 0;

    if (currentDate > dueDate) {
      const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 2;  // Rs. 2 fine per day
    }

    book.status = 'Active';
    book.issuedAt = null;
    book.dueDate = null;
    book.fine = fine;
    await book.save();

    // Remove book from user's reservedBooks if necessary
    const user = await User.findOne({ reservedBooks: { $elemMatch: { bookId: book._id } } });
    if (user) {
      user.reservedBooks = user.reservedBooks.filter((b) => b.bookId.toString() !== book._id.toString());
      await user.save();
    }

    res.status(200).json({ message: 'Book returned successfully.', fine });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

module.exports = {
  uploadBooksCSV,
  listBooks,
  searchBooks,
  updateBookStatus,
  reserveBook,
  cancelReservation,
  issueBook,
  handleReturnBook
};
