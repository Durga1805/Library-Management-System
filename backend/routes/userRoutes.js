// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\userRoutes.js
const express = require('express');
const multer = require('multer');
const {
  uploadCSV,
  login,
  listUsers,
  updateUserStatus,
  searchUsers,
  updateUserProfile,
} = require('../controllers/userController');

const router = express.Router();

// Multer setup to handle file uploads (CSV and profile pictures)
const storage = multer.memoryStorage();  // Store files in memory as buffer
const upload = multer({ storage });

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

// PUT route for updating user profile, including profile picture
router.put('/users/profile', upload.single('profilePic'), updateUserProfile);

module.exports = router;