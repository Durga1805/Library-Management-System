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
    // book.issuedAt = null;
    // book.dueDate = null;
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








module.exports = {
  uploadBooksCSV,
  listBooks,
  searchBooks,
  updateBookStatus,
  getAvailableBooks,
  reserveBook,
  cancelReservation,
  issueBook,
  handleReturnBook,
  getHistory,
};
