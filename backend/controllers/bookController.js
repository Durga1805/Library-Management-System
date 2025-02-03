// backend\controllers\bookController.js

const Book = require('../models/Book');
const User = require('../models/User');
const Staff = require('../models/Staff');
const History = require('../models/History');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');

// Function to upload books from a CSV file
const uploadBooksCSV = async (req, res) => {
  const results = [];
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Read CSV file
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        const duplicates = [];
        const booksToAdd = [];

        // Iterate over the parsed CSV data
        for (let row of results) {
          const { accno, isbn } = row;

          // Check if the book already exists based on accno or isbn
          const existingBook = await Book.findOne({ 
            $or: [{ accno }, { isbn }] 
          });

          if (existingBook) {
            // If a duplicate is found, add it to the duplicates array
            duplicates.push({ title: row.title, accno, isbn });
          } else {
            // If no duplicate, create a new book object
            const newBook = new Book({
              accno: row.accno,
              call_no: row.call_no,
              title: row.title,
              year_of_publication: parseInt(row.year_of_publication, 10),
              author: row.author,
              publisher: row.publisher,
              isbn: row.isbn,
              no_of_pages: parseInt(row.no_of_pages, 10),
              price: parseFloat(row.price),
              dept: row.dept,
              cover_type: row.cover_type,
              status: row.status,
            });
            booksToAdd.push(newBook);
          }
        }

        // Save all the books that are not duplicates
        if (booksToAdd.length > 0) {
          await Book.insertMany(booksToAdd);
        }

        res.status(201).json({
          message: 'CSV processed successfully.',
          addedBooks: booksToAdd.length,
          duplicates: duplicates.length,
          duplicateEntries: duplicates, // Provide detailed duplicate information
        });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error processing CSV file', error: error.message });
  }
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




// Return Book Function
const returnBook = async (req, res) => {
  try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      if (book.status !== 'Issued') {
          return res.status(400).json({ message: 'Book is not issued' });
      }

      // Calculate fine (Assuming 2 Rs per day after due date)
      const dueDate = new Date(book.dueDate);
      const today = new Date();
      let fine = 0;

      if (today > dueDate) {
          const diffTime = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          fine = diffTime * 2;
      }

      return res.status(200).json({ fine });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

const confirmPaymentAndReturn = async (req, res) => {
  try {
      const { bookId } = req.params;
      const { paymentSuccess } = req.body;

      if (!paymentSuccess) {
          return res.status(400).json({ message: 'Payment required' });
      }

      const book = await Book.findById(bookId);
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      // Update book status
      book.status = 'Active';
      book.fine = 0;
      await book.save();

      return res.status(200).json({ message: 'Book returned successfully', fine: 0 });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};







// Fetch available books
const getAvailableBooks = async (req, res) => {
  try {
    const availableBooks = await Book.find({ status: 'Available' });
    res.status(200).json(availableBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available books', error: error.message });
  }
};




const getHistory = async (req, res) => {
  const { userId } = req.query;
  console.log('History request received');

  try {
    // Check if user exists in User or Staff collection
    let user = await User.findOne({ userid: userId });
    if (!user) {
      user = await Staff.findOne({ userid: userId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compile user activity history
    const reservedBooks = user.reservedBooks.map((book) => ({
      title: book.title,
      type: 'Reserved',
      date: book.reservedAt,
    }));

    const issuedBooks = await Book.find({ reserved: userId, status: 'Issued' });
    const issuedHistory = issuedBooks.map((book) => ({
      title: book.title,
      type: 'Issued',
      date: book.issuedAt,
      fine: book.fine || 0,
    }));

    const returnedBooks = await Book.find({ reserved: userId, status: 'Returned' });
    const returnedHistory = returnedBooks.map((book) => ({
      title: book.title,
      type: 'Returned',
      date: book.returnedAt,
      fine: book.fine || 0,
    }));

    const history = [...reservedBooks, ...issuedHistory, ...returnedHistory];
    res.status(200).json(history);

    // Optionally, store each action in the History model
    // await History.create({ userId, action: 'Viewed History', timestamp: new Date() });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching history.', error: error.message });
  }
};




// Controller for generating report for reserved and issued books
const generateBookReport = async (req, res) => {
  try {
    // Log when the report is being generated
    console.log("Generating book report...");

    // Fetch all books with status "Reserved" or "Issued"
    const booksReport = await Book.find({
      status: { $in: ['Reserved', 'Issued'] }
    }).lean();  // Using lean() for better performance

    // Format dates and handle user data
    const formattedReport = booksReport.map(book => ({
      ...book,
      reservedBy: book.reservedBy ? { name: book.reservedBy } : null,
      reservedAt: book.reservedAt || null,
      issuedAt: book.issuedAt || null,
      dueDate: book.dueDate || null,
      fine: book.fine || 0
    }));

    console.log("Formatted report:", formattedReport);
    res.status(200).json(formattedReport);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'An error occurred while generating the report' });
  }
};





module.exports = {
  uploadBooksCSV,
  listBooks,
  searchBooks,
  updateBookStatus,
  getAvailableBooks,
  reserveBook,
  cancelReservation,
  issueBook,
  returnBook, // Fixed function export
  confirmPaymentAndReturn, // Added missing function export
  getHistory,
  generateBookReport
  };
