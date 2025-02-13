const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all users route should come before parameterized routes
router.get('/all', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/csv-template', userController.getCSVTemplate);

// Profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/update-profile', auth, userController.updateProfile);
router.post('/change-password', auth, userController.changePassword);
router.post('/upload-profile-pic', auth, upload.single('profilePic'), userController.uploadProfilePic);

// Staff management routes
router.post('/addStaff', userController.addStaff);
router.post('/uploadStudents', userController.uploadStudents);

// Get user by ID route should come last
router.get('/:id', userController.getUserProfile);
router.get('/:userId/full-profile', auth, userController.getFullProfile);
router.get('/:userId/activities', auth, userController.getUserActivities);

// Add this to your existing routes
router.put('/:userId/status', auth, userController.updateUserStatus);

module.exports = router; 