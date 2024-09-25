const express = require('express');
const multer = require('multer');
const { uploadCSV, login, listUsers } = require('../controllers/userController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST route for uploading CSV file
router.post('/upload-csv', upload.single('csvFile'), uploadCSV);

// POST route for login
router.post('/login', login);

// GET route for fetching users without password
router.get('/users', listUsers);

module.exports = router;
