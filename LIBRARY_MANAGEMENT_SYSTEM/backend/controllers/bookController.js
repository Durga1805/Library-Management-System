// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\bookController.js
const Book = require('../models/Book');
const csv = require('csv-parser');
const fs = require('fs');

// Function to upload books from a CSV file
const uploadBooksCSV = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Book.insertMany(results);
        res.status(200).json({ message: 'Books uploaded successfully!' });
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
  const { id } = req.params; // Get book ID from URL parameters
  const { status } = req.body; // Get the new status from request body

  // Validate the status
  if (!status || !['Active', 'Deactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Active or Deactive.' });
  }

  try {
    // Find the book by ID and update its status
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json({ message: 'Book status updated successfully.', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book status', error: error.message });
  }
};

// Exporting the functions for use in routes
module.exports = { uploadBooksCSV, listBooks, searchBooks, updateBookStatus };
