// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\userRoutes.js
const express = require('express');
const multer = require('multer');
const {
  uploadCSV,
  login,
  listUsers,
  updateUserStatus,
  searchUsers,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST route for uploading CSV file
router.post('/upload-csv', upload.single('csvFile'), uploadCSV);

// POST route for login
router.post('/login', login);

// GET route for fetching users without password
router.get('/users', listUsers);

// PUT route for updating user status
router.put('/users/:userId/status', updateUserStatus);

// GET route for searching users
router.get('/users/search', searchUsers);

// POST route for handling forgot password request
router.post('/forgot-password', forgotPassword);

// POST route for handling password reset with token
router.post('/reset-password/:token', resetPassword);

module.exports = router;
