const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: String,
  year: Number,
  description: String,
  reason: {
    type: String,
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  adminResponse: String,
  responseDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('BookRequest', bookRequestSchema); 