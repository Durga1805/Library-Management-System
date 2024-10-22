// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\bookRoutes.js
const express = require('express');
const multer = require('multer');
const {
    uploadBooksCSV,
    listBooks,
    searchBooks,
    reserveBook,
    getReservedBooks,
    updateBookStatus,
} = require('../controllers/bookController');

const router = express.Router();
// Temporary upload folder
const upload = multer({ dest: 'uploads/' }); 

// POST route for uploading CSV file and adding books
router.post('/books/upload-csv', upload.single('file'), uploadBooksCSV);

// GET route for listing all books
router.get('/books', listBooks);

// GET route for searching books
router.get('/books/search', searchBooks);

// Reserve a book
router.post('/books/:bookId/reserve', reserveBook); 

// Admin view of reserved books
router.get('/reserved', getReservedBooks);

// Define the PUT route
router.put('/books/:id/status', updateBookStatus); 

module.exports = router;

