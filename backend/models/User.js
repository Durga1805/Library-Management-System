const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneno: {
    type: String,
    required: true,
    match: /^[6789]\d{9}$/
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dept: {
    type: String,
    required: true,
    enum: ['CSE', 'MCA', 'IT', 'Mathematics','Library']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Deactive'],
    default: 'Active'
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['staff', 'student', 'admin'],
    default: 'student'
  },
  userid: {
    type: String,
    unique: true,
    required: true
  },
  // Student specific fields
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: function() { return this.role === 'student'; }
  },
  startDate: {
    type: Date,
    required: function() { return this.role === 'student'; }
  },
  endDate: {
    type: Date,
    required: function() { return this.role === 'student'; }
  },
  // Add profilePic field to the schema
  profilePic: {
    type: String
  },
  borrowHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  paidFines: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the comparePassword method to handle plain text passwords during development
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // For development: allow plain text password comparison
    if (this.password === candidatePassword) {
      console.log('Plain text password match');
      return true;
    }
    
    // For hashed passwords
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Hashed password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 