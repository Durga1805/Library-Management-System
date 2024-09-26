// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\bookRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadBooksCSV, listBooks, searchBooks } = require('../controllers/bookController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST route for uploading CSV file and adding books
router.post('/books/upload-csv', upload.single('file'), uploadBooksCSV);

// GET route for listing all books
router.get('/books', listBooks);  // Route to list books

// GET route for searching books
router.get('/books/search', searchBooks);

module.exports = router;
