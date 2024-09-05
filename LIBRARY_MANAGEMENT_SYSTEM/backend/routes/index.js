const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle CSV file upload
router.post('/upload-csv', upload.single('file'), userController.uploadCsv);

module.exports = router;
