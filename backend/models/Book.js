const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  accession_no: { type: Number, required: true, unique: true },
  call_no: { type: String, required: true },
  title: { type: String, required: true },
  year_of_publication: { type: Number, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  isbn: { type: String, required: true },
  no_of_pages: { type: Number, required: true },
  price: { type: Number, required: true },
  dept: {
    type: String,
    required: true,
    enum: [
      'CSE',
      'IT',
      'MCA',
      'Mathematics',
      'Novel-ML',
      'Novel-EN',
      'Story-EN',
      'Story-ML',
      'Travelogue-ML',
      'Travelogue-EN',
      'Poem-ML',
      'Poem-EN',
      'Autobiography-ML',
      'Autobiography-EN'
    ]
  },
  cover_type: { type: String, required: true },
  status: {
    type: String,
    enum: ['Available', 'Issued', 'Reserved'],
    default: 'Available'
  },
  reservedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reservedAt: { type: Date },
  reserved: { type: String, default: 'No' },
  issuedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issuedAt: Date,
  dueDate: Date,
  fine: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add a pre-save hook to ensure consistency
bookSchema.pre('save', function(next) {
  if (this.status === 'Reserved') {
    this.reserved = 'Yes';
  } else {
    this.reserved = 'No';
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema); 