// controllers/staffController.js
const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');

// Add Staff Controller
const addStaff = async (req, res) => {
  try {
    const { userid, name, dob, address, phoneno, email, dept, status, password } = req.body;

    // Check if the email or userid already exists
    const existingStaff = await Staff.findOne({ $or: [{ email }, { userid }] });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff member with this email or userid already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      userid,
      name,
      dob,
      address,
      phoneno,
      email,
      dept,
      status: status || 'active', // Default to 'active' if status is not provided
      password: hashedPassword,
    });

    await newStaff.save();
    res.status(201).json({ message: 'Staff member added successfully!' });
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Server error while adding staff member' });
  }
};


// List All Staff Members Controller
const listStaff = async (req, res) => {
    try {
      // Fetch all staff members from the database
      const staffList = await Staff.find({});
      res.status(200).json(staffList); // Send the list as JSON response
    } catch (error) {
      console.error('Error fetching staff list:', error);
      res.status(500).json({ message: 'Server error while fetching staff list' });
    }
  };
  
  module.exports = { addStaff, listStaff };