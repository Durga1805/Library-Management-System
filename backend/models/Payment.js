const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'online'
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware to get book title
paymentSchema.pre('save', async function(next) {
  if (this.bookId) {
    const Book = mongoose.model('Book');
    const book = await Book.findById(this.bookId);
    if (book) {
      this.bookTitle = book.title;
    }
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema); 