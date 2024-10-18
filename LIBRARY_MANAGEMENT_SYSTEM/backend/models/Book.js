// LIBRARY_MANAGEMENT_SYSTEM\backend\models\Book.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  accno: { type: String, required: true },
  call_no: { type: String, required: true },
  title: { type: String, required: true },
  year_of_publication: { type: Number, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  isbn: { type: String, required: true },
  no_of_pages: { type: Number, required: true },
  price: { type: Number, required: true },
  dept: { type: String, required: true },
  cover_type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Deactive', 'Reserved'], default: 'Active' },
  reservedByStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  reservedByStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  reservationDate: { type: Date }
});

module.exports = mongoose.model('Book', bookSchema);
