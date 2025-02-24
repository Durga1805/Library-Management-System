const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const reminderService = require('./services/reminderService');
const cron = require('node-cron');

// Route imports
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chatbotRoutes = require("./routes/chatbotRoutes");
const reportRoutes = require('./routes/reportRoutes');
const newspaperRoutes = require('./routes/newspaperRoutes');
const bookRequestRoutes = require('./routes/bookRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { verifyConnection } = require('./utils/emailService');
const paymentRoutes = require('./routes/paymentRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Create required directories
const uploadsDir = path.join(__dirname, 'uploads');
const newspapersDir = path.join(__dirname, 'uploads/newspapers');

if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(newspapersDir)){
    fs.mkdirSync(newspapersDir, { recursive: true });
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', chatbotRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/newspapers', newspaperRoutes);
app.use('/api/books/request', bookRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);

// Schedule reminder check to run at 12:15 PM IST every day
cron.schedule('15 12 * * *', async () => {
  console.log('Running due date reminders check at 12:15 PM...');
  try {
    await reminderService.sendDueDateReminders();
    console.log('Reminder check completed successfully');
  } catch (error) {
    console.error('Error running reminder check:', error);
  }
}, {
  timezone: "Asia/Kolkata" // For Indian Standard Time
});

// Multer error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 10MB'
      });
    }
    return res.status(400).json({
      message: error.message
    });
  }
  next(error);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Catch Unhandled Rejections & Exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Verify Email Service Connection
verifyConnection()
  .then(success => {
    if (!success) {
      console.error('Warning: Email service is not properly configured');
    }
  })
  .catch(error => {
    console.error('Error verifying email connection:', error);
  });

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
