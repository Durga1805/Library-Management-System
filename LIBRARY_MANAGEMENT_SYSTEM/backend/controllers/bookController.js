// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\bookController
const csv = require('csv-parser');
const fs = require('fs');
const Book = require('../models/Book');

// Function to handle CSV upload and book creation
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
    const books = await Book.find(); // Fetch all books from the database
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Function to search for books
const searchBooks = async (req, res) => {
  const { type, query } = req.query;
  let searchCriteria = {};

  // Validate query parameters
  if (!type || !query) {
    return res.status(400).json({ message: 'Type and query are required.' });
  }

  if (type === 'title') {
    searchCriteria.title = new RegExp(query, 'i'); // Case insensitive search
  } else if (type === 'author') {
    searchCriteria.author = new RegExp(query, 'i');
  } else if (type === 'isbn') {
    searchCriteria.isbn = query;
  } else {
    return res.status(400).json({ message: 'Invalid search type.' });
  }

  try {
    const books = await Book.find(searchCriteria);
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found' });
    }
    res.status(200).json(books); // Send back the list of books
  } catch (error) {
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
};

module.exports = { uploadBooksCSV, listBooks, searchBooks };

