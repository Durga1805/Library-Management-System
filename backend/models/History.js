// backend/models/History.js
const mongoose = require('mongoose');

// Define the schema for the History model
const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user (student or staff)
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the book
  action: { 
    type: String, 
    enum: ['Reserved', 'Issued', 'Returned', 'Fine Applied', 'Fine Paid'], // Possible actions
    required: true
  },
  actionDate: { type: Date, default: Date.now }, // Timestamp of the action
  fineAmount: { type: Number, default: 0 }, // Optional: fine amount applied (if any)
});

const History = mongoose.model('History', historySchema);

module.exports = History;
