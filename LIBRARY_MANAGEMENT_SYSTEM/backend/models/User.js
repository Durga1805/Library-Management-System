// LIBRARY_MANAGEMENT_SYSTEM\backend\models\User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  status: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: Buffer },
  resetPasswordToken: { type: String }, // Field to store the token
  resetPasswordExpires: { type: Date },  // Storing image as Buffer
  role: { type: String, default: 'student' }, // Role is either 'student' or 'staff'
  reservedBooks: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      reservedAt: { type: Date, default: Date.now },
    }
  ]
});

 
const Student = mongoose.model('Students', userSchema, 'Students');

module.exports = Student;
