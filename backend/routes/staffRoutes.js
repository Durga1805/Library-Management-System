// routes/staffRoutes.js
const express = require('express');
const { addStaff, listStaff } = require('../controllers/staffController'); // Import listStaff controller
const router = express.Router();

// Route to add a staff member
router.post('/addstaff', addStaff);

// Route to list all staff members
router.get('/liststaff', listStaff); // New route to fetch staff list

module.exports = router;
