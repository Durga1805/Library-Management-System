// LIBRARY_MANAGEMENT_SYSTEM\backend\routes\staffRoutes.js
const express = require('express');
const { addStaff, listStaff, loginStaff } = require('../controllers/staffController');
// const { forgotPassword, resetPassword } = require('../controllers/forgotPasswordController');
const router = express.Router();

// Route to add a staff member
router.post('/addstaff', addStaff);

// Route to list all staff members
router.get('/liststaff', listStaff);

// Route for staff login
router.post('/staff-login', loginStaff);

// // Route for forgot password
// router.post('/staff/forgot-password', forgotPassword);


// // Route for resetting password
// router.post('/staff/reset-password', resetPassword);


module.exports = router;
1   