const mongoose = require('mongoose');

const bookActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  type: {
    type: String,
    enum: ['issue', 'return', 'reserve', 'payment'],
    required: true
  },
  fine: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BookActivity', bookActivitySchema); 