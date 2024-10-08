const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/User');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to handle CSV upload and user creation
const uploadCSV = async (req, res) => {
  const results = [];
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (let row of results) {
          const dob = moment(row.dob, 'YYYY-MM-DD').toDate();

          if (!moment(dob).isValid()) {
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
            password: await bcrypt.hash(row.password || 'DefaultPassword123', 10),
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ success: true, token, userId: user.userid });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Forgot Password - Send Reset Link
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const resetToken = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
             <p>This link is valid for 24 hours.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email', error: error.message });
  }
};
