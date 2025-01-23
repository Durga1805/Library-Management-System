
// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\staffController.js
const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const staffList = await Staff.find({});
    res.status(200).json(staffList);
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).json({ message: 'Server error while fetching staff list' });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(400).json({ message: 'Staff member not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token with expiration time (e.g., 1 hour)
    const token = jwt.sign({ staffId: staff._id, name: staff.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true,  userId: staff.userid, token, name: staff.name });
  } catch (error) {
    console.error('Error logging in staff:', error);
    res.status(500).json({ message: 'Server error while logging in' });
  }
};

module.exports = { addStaff, listStaff, loginStaff };
