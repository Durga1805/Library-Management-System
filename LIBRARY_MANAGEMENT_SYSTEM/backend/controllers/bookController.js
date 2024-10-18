// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\bookController.js
const Book = require('../models/Book');
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/User'); // Assuming you have a User model for students
const Staff = require('../models/Staff'); // Import Staff model

// Function to upload books from a CSV file
const uploadBooksCSV = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Validate CSV data to ensure required fields exist
      if (data.accno && data.title && data.author && data.status) {
        results.push({
          accno: data.accno,
          call_no: data.call_no || '', // default to empty if call_no is not provided
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
      // Delete the uploaded CSV file after processing
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
  const { userId, userType } = req.body; // Ensure these are passed in request body or session/auth token

  if (!userId || !userType) {
    return res.status(400).json({ message: 'Missing user ID or user type' });
  }try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status === 'Deactive') {
      return res.status(400).json({ message: 'Book is deactivated and cannot be reserved' });
    }

    if (book.status === 'Reserved') {
      return res.status(400).json({ message: 'Book is already reserved' });
    }

    // Reserve the book
    book.status = 'Reserved';

    // Track who reserved the book
    if (userType === 'student') {
      const student = await Student.findById(userId);
      if (!student) {
        return res.status(400).json({ message: 'Student not found' });
      }
      book.reservedByStudent = userId;
    } else if (userType === 'staff') {
      const staff = await Staff.findById(userId);
      if (!staff) {
        return res.status(400).json({ message: 'Staff member not found' });
      }
      book.reservedByStaff = userId;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }
  
    // Add reservation date
    book.reservationDate = new Date();

    await book.save();
    res.status(200).json({ message: 'Book reserved successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving book', error: error.message });
  }
};

// Function to get all reserved books
const getReservedBooks = async (req, res) => {
  try {
    const reservedBooks = await Book.find({ status: 'Reserved' })
      .populate('reservedByStudent')  // Populate student reference if exists
      .populate('reservedByStaff');   // Populate staff reference if exists

    if (!reservedBooks.length) {
      return res.status(404).json({ message: 'No reserved books found' });
    }

    res.status(200).json(reservedBooks); // Send the list of reserved books
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserved books', error: error.message });
  }
};

module.exports = { uploadBooksCSV, listBooks, searchBooks, updateBookStatus, reserveBook, getReservedBooks };
