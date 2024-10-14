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
  profilePic: { type: Buffer },  // Storing image as Buffer
});

const Student = mongoose.model('Students', userSchema, 'Students');

module.exports = Student;
