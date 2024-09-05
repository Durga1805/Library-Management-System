const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  accno: { type: String, required: true, unique: true },
  call_no: { type: String, required: true },
  title: { type: String, required: true, maxlength: 255 },
  year_of_publication: { type: Number, required: true, min: [1000, 'Year must be at least 1000'], max: [new Date().getFullYear(), 'Year cannot be in the future'] },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  isbn: { type: String, required: true, unique: true, match: [/^\d{13}$/, 'Invalid ISBN format'] },
  no_of_pages: { type: Number, required: true, min: [1, 'Number of pages must be at least 1'] },
  price: { type: Number, required: true, min: [0, 'Price must be a positive number'] },
  type: { type: String, enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography'], required: true },
  dept: { type: String, required: true },
  cover_type: { type: String, enum: ['Hardcover', 'Paperback'], required: true },
  status: { type: String, enum: ['Available', 'Checked Out', 'Reserved'], required: true }
});

module.exports = mongoose.model('Book', bookSchema);
