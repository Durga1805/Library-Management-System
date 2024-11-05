// LIBRARY_MANAGEMENT_SYSTEM\backend\server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const staffRoutes = require('./routes/staffRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({origin : "https://library-management-system-ixpc.onrender.com"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MyDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => console.log('MongoDB connection error:', error));

// Routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);  // Add book routes
app.use('/api', staffRoutes);
app.use('/api', feedbackRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
