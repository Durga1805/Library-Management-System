const express = require('express');
const multer = require('multer');
const { uploadBooksCSV, listBooks } = require('../controllers/bookController'); // Import listBooks

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST route for uploading CSV file and adding books
router.post('/books/upload-csv', upload.single('file'), uploadBooksCSV);

// GET route for listing all books
router.get('/books', listBooks);  // New route to list books

module.exports = router;
