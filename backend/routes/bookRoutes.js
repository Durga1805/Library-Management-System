const express = require('express');
const multer = require('multer');
const { uploadBooksCSV, listBooks, searchBooks, updateBookStatus, reserveBook } = require('../controllers/bookController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary upload folder

// POST route for uploading CSV file and adding books
router.post('/books/upload-csv', upload.single('file'), uploadBooksCSV);

// GET route for listing all books
router.get('/books', listBooks);

// GET route for searching books
router.get('/books/search', searchBooks);

// PUT route to update the status of a book
router.put('/books/:id/status', updateBookStatus);

// POST route to reserve a book
router.post('/books/:bookId/reserve', reserveBook);

module.exports = router;
