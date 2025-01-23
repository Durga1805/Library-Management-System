const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },  // Include user ID
  name: { type: String, required: true },    // Include username
});

module.exports = mongoose.model('Feedback', feedbackSchema);
