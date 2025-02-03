
// backend\models\Book.js
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
  status: { type: String, enum: ['Active', 'Deactive', 'Reserved', 'Issued'], default: 'Active' },
  reservedBy: { type: String }, // Store user's name directly as a string
  reservedAt: { type: Date },
  reserved:{type:String,required:true},
  
  issuedAt: { type: Date }, 
  dueDate: { type: Date }, // New field for due date
  returnedAt: { type: Date },
  fine: { type: Number, default: 0 }, // New field for fine
});

module.exports = mongoose.model('Book', bookSchema);
