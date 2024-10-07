// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\userController.js
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/User');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to handle CSV upload and user creation
const uploadCSV = async (req, res) => {
  const results = [];
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Read CSV file
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        for (let row of results) {
          const dob = moment(row.dob, 'YYYY-MM-DD').toDate(); // Parse dob

          // Check if the parsed date is valid
          if (!moment(dob).isValid()) {
            console.error(`Invalid date format for user ${row.name}: ${row.dob}`);
            return res.status(400).json({ message: `Invalid date format for user ${row.name}: ${row.dob}` });
          }

          const newUser = new Student({
            userid: row.userid,
            name: row.name,
            dob: dob,
            address: row.address,
            phoneno: row.phoneno,
            email: row.email,
            dept: row.dept || 'DefaultDept',
            status: row.status || 'Active',
            password: await bcrypt.hash(row.password || 'DefaultPassword123', 10), // Hash password
          });

          try {
            await newUser.save();
          } catch (err) {
            console.error(`Error saving user ${row.name}: ${err.message}`);
            return res.status(500).json({ message: `Error saving user ${row.name}`, error: err.message });
          }
        }

        res.status(201).json({ message: 'Users successfully added!' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error processing CSV file', error: error.message });
  }
};

// Function to handle login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ success: true, token, userId: user.userid });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Function to get users without password
const listUsers = async (req, res) => {
  try {
    const students = await Student.find({}, '-password'); // Exclude password field
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};

// Function to update user status
const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await Student.findByIdAndUpdate(userId, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status', error: error.message });
  }
};

// Function to search users by userid, name, or email
const searchUsers = async (req, res) => {
  const { userid, name, email } = req.query;

  try {
    let query = {};

    if (userid) {
      query.userid = userid;
    }
    if (name) {
      query.name = new RegExp(name, 'i'); // Case-insensitive search
    }
    if (email) {
      query.email = email;
    }

    const users = await Student.find(query, '-password');
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for users', error: error.message });
  }
};

module.exports = { uploadCSV, login, listUsers, updateUserStatus, searchUsers };
