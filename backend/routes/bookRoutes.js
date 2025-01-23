// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\bookRoutes.js
const express = require('express');
const multer = require('multer');
const {
    uploadBooksCSV,
    listBooks,
    searchBooks,
    reserveBook,
    cancelReservation,
    updateBookStatus,
    issueBook,
    handleReturnBook,
    getAvailableBooks,
    getHistory,
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


// Cancel a reservation and change the book status to 'Active'
router.post('/books/:bookId/cancel', cancelReservation);

// Define the PUT route
router.put('/books/:id/status', updateBookStatus); 

router.patch('/books/issue/:id', issueBook);


// Route to return a book
router.patch('/books/return/:id', handleReturnBook);


// Route to fetch available books
router.get('/books/available', getAvailableBooks);

// GET route for user history
router.get('/books/history', getHistory);


module.exports = router;

