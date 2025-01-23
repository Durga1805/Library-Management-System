// backend/models/History.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to Book model
    required: true,
  },
  action: {
    type: String,
    enum: ['Reserved', 'Issued', 'Returned'], // Or any other actions
    required: true,
  },
  fine: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);
