// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\bookRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadBooksCSV, listBooks, searchBooks, updateBookStatus } = require('../controllers/bookController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary upload folder

// POST route for uploading CSV file and adding books
router.post('/books/upload-csv', upload.single('file'), uploadBooksCSV);

// GET route for listing all books
router.get('/books', listBooks);

// GET route for searching books
router.get('/books/search', searchBooks);

// PUT route to update the status of a book (Active/Deactive)
router.put('/books/:id/status', updateBookStatus); // New route

module.exports = router;
