const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: String,
  name: String,
  dob: Date,
  address: String,
  phoneno: String,
  startdate: Date,
  enddate: Date,
  email: String,
  password: String,
  deptid: String,
  semid: String,
  desigid: String,
  picture: String,
  status: String,
}, { collection: 'Staff_Student' }); // Specify the collection name here

const User = mongoose.model('User', userSchema);

module.exports = User;
