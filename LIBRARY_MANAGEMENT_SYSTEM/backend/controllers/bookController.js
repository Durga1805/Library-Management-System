const Book = require('../models/Book');
const csv = require('csv-parser');
const fs = require('fs');
const User = require('../models/User'); // Model for students
const Staff = require('../models/Staff'); // Model for staff
const mongoose = require('mongoose');

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

// Function to reserve a book by student or staff
const reserveBook = async (req, res) => {
  console.log("reserveBook function called");  // Log function call

  const { bookId } = req.params;
  const { userId } = req.body; // Fetching userId from request body

  // Log userId and bookId
  console.log("Request Parameters - bookId:", bookId);
  console.log("Request Body - userId:", userId);

  try {
    // Validate if the bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      console.log("Invalid book ID format"); // Log if invalid book ID
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    

    const book = await Book.findById(bookId);
    if (!book) {
      console.log("Book not found");  // Log if book is not found
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status === 'Reserved') {
      console.log("Book already reserved");  // Log if book is already reserved
      return res.status(400).json({ message: 'Book already reserved' });
    }

    // Find the user based on the custom `userid` field in the User and Staff collections
    let user = await User.findOne({ userid: userId }); // Change to 'userid'
    console.log("User from User collection:", user); // Log user found in User collection

    // If user is not found in the User collection, try Staff collection
    if (!user) {
      user = await Staff.findOne({ userid: userId }); // Change to 'userid'
      console.log("User from Staff collection:", user); // Log user found in Staff collection
    }

    if (!user) {
      console.log("User not found");  // Log if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log("User found:", user);  // Log the entire user object
    console.log("username",user.name)
    // Reserve the book and store the user's name instead of ObjectId
    book.status = 'Reserved';
    book.reservedBy = user.name; // Store user's name instead of ObjectId
    book.reservedAt = new Date();
    await book.save();

    // Add the book to the user's reserved books
    user.reservedBooks.push({
      bookId: book._id,
      reservedAt: new Date(),
    });
    await user.save();

    console.log("Book reserved successfully");  // Log success
    res.status(200).json({ message: 'Book reserved successfully' });
  } catch (error) {
    console.error('Error reserving the book:', error);  // Log error
    res.status(500).json({ message: 'Error reserving the book', error: error.message });
  }
};


// Function to get all reserved books for admin view
const getReservedBooks = async (req, res) => {
  console.log("Fetching reserved books...");
  try {
      const books = await Book.find({ status: 'Reserved' })
          .populate('reservedBy', 'email role userId') // Include userId from reservedBy
          .exec();

      const reservedBooksDetails = books.map(book => ({
          _id: book._id,
          title: book.title,
          accessionNumber: book.accessionNumber, // Include accessionNumber
          reservedBy: book.reservedBy.email,
          userId: book.reservedBy.userId, // Include userId
          role: book.reservedBy.role,
          reservedAt: book.reservedAt,
      }));

      res.status(200).json(reservedBooksDetails);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching reserved books', error: error.message });
  }
};


module.exports = {
  uploadBooksCSV,
  listBooks,
  searchBooks,
  updateBookStatus,
  reserveBook,
  getReservedBooks,
};