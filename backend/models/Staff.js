// models/Staff.js
const mongoose = require('mongoose');

// Define the schema for the Staff model
const staffSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  status: { type: String, default: 'active' },
  password: { type: String, required: true },
  resetPasswordToken: { type: String }, // Field to store the token
  resetPasswordExpires: { type: Date },
  role: { type: String, default: 'staff' },
  reservedBooks: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      reservedAt: { type: Date, default: Date.now },
    }
  ]
}, {
  timestamps: true,
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
