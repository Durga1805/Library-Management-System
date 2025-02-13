const mongoose = require('mongoose');
const User = require('../models/User');
const { validateStudentData } = require('../utils/csvValidator');
const { sendCredentialEmail } = require('../utils/emailService');
const bcrypt = require('bcrypt');
const BookActivity = require('../models/BookActivity');

// Add staff member
exports.addStaff = async (req, res) => {
  try {
    // Validate email domain
    if (!req.body.email.endsWith('@gmail.com')) {
      return res.status(400).json({
        message: 'Invalid email domain',
        error: 'Staff email must end with @gmail.com'
      });
    }

    // Generate a random password if not provided
    const plainPassword = req.body.password || Math.random().toString(36).slice(-8);

    const staffData = {
      ...req.body,
      role: 'staff',
      userid: `STF${Math.floor(10000 + Math.random() * 90000)}`,
      password: plainPassword // This will be hashed by the pre-save middleware
    };

    const newStaff = new User(staffData);
    await newStaff.save();

    try {
      // Send email with credentials
      await sendCredentialEmail(
        newStaff.email,
        newStaff.name,
        newStaff.userid,
        plainPassword,
        'staff'
      );

      const credentials = {
        name: newStaff.name,
        userid: newStaff.userid,
        password: plainPassword,
        email: newStaff.email
      };

      res.status(201).json({ 
        message: 'Staff added successfully and credentials sent via email', 
        staff: credentials 
      });
    } catch (emailError) {
      console.error('Detailed email error:', {
        error: emailError,
        stack: emailError.stack,
        code: emailError.code,
        command: emailError.command
      });
      
      res.status(201).json({ 
        message: `Staff added successfully but failed to send email (${emailError.message})`, 
        staff: {
          name: newStaff.name,
          userid: newStaff.userid,
          password: plainPassword,
          email: newStaff.email
        }
      });
    }
  } catch (error) {
    console.error('Error adding staff:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entry found',
        error: 'Email or UserID already exists'
      });
    }
    res.status(500).json({ 
      message: 'Error adding staff', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Upload multiple students from CSV
exports.uploadStudents = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid data format',
        error: 'No valid data found in CSV' 
      });
    }

    // Validate student email domains
    const invalidEmails = users.filter(user => !user.email.endsWith('@mca.ajce.in'));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        message: 'Invalid email domains',
        error: 'All student emails must end with @mca.ajce.in',
        invalidEmails: invalidEmails.map(user => user.email)
      });
    }

    console.log('Processing students:', users.length);

    const validationErrors = [];
    const processedStudents = [];

    // Validate each student's data
    users.forEach((student, index) => {
      try {
        const cleanedStudent = Object.keys(student).reduce((acc, key) => {
          acc[key] = typeof student[key] === 'string' ? student[key].trim() : student[key];
          return acc;
        }, {});

        const errors = validateStudentData(cleanedStudent);
        if (errors.length > 0) {
          validationErrors.push({
            row: index + 1,
            errors: errors
          });
        } else {
          // Generate department-specific userid
          const deptPrefix = cleanedStudent.dept.substring(0, 3).toUpperCase();
          const randomNum = Math.floor(10000 + Math.random() * 90000);
          const userid = `${deptPrefix}${randomNum}`;
          const password = Math.random().toString(36).slice(-8);

          // Process valid student data
          const studentData = {
            ...cleanedStudent,
            role: 'student',
            status: 'Active',
            userid: userid,
            password: password,
            dob: new Date(cleanedStudent.dob),
            startDate: new Date(cleanedStudent.startDate),
            endDate: new Date(cleanedStudent.endDate),
            semester: parseInt(cleanedStudent.semester)
          };

          console.log('Processing student:', studentData.email);
          processedStudents.push(studentData);
        }
      } catch (error) {
        console.error(`Error processing student at row ${index + 1}:`, error);
        validationErrors.push({
          row: index + 1,
          errors: [`Processing error: ${error.message}`]
        });
      }
    });

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation errors in CSV data',
        errors: validationErrors
      });
    }

    console.log('Inserting students:', processedStudents.length);

    // Insert valid students
    const result = await User.insertMany(processedStudents);
    
    // Send emails to all students
    const emailPromises = result.map(student => 
      sendCredentialEmail(
        student.email,
        student.name,
        student.userid,
        student.password,
        'student'
      )
    );

    const emailResults = await Promise.allSettled(emailPromises);
    const failedEmails = emailResults
      .map((result, index) => result.status === 'rejected' ? result.value.email : null)
      .filter(Boolean);

    // Generate response with student credentials
    const credentials = result.map(student => ({
      name: student.name,
      userid: student.userid,
      password: student.password,
      email: student.email,
      dept: student.dept,
      semester: student.semester
    }));

    res.status(201).json({
      message: 'Students uploaded successfully' + 
        (failedEmails.length === 0 ? ' and all credentials sent via email' : 
        `. Failed to send emails to ${failedEmails.length} students`),
      count: result.length,
      credentials: credentials,
      failedEmails: failedEmails
    });

  } catch (error) {
    console.error('Error uploading students:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entries found',
        error: 'Some students already exist in the system (duplicate email)'
      });
    }

    res.status(500).json({
      message: 'Error uploading students',
      error: error.message || 'Internal server error',
      stack: error.stack
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password field
      .sort({ name: 1 }); // Sort by name ascending

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { userid: searchRegex }
      ]
    })
    .select('-password')
    .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      message: 'Error searching users',
      error: error.message 
    });
  }
};

// Add a new endpoint to get the CSV template
exports.getCSVTemplate = (req, res) => {
  const template = {
    headers: ['name', 'dob', 'email', 'phoneno', 'address', 'dept', 'semester', 'startDate', 'endDate'],
    sampleRow: {
      name: 'John Doe',
      dob: '2000-01-01',
      email: 'john@example.com',
      phoneno: '9876543210',
      address: '123 Main St',
      dept: 'CSE',
      semester: '1',
      startDate: '2024-01-01',
      endDate: '2028-01-01'
    }
  };
  
  res.status(200).json(template);
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the file path
    const profilePicPath = `/uploads/${req.file.filename}`;
    
    // Update user's profile pic path in database
    user.profilePic = profilePicPath;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePic: profilePicPath
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ 
      message: 'Error uploading profile picture',
      error: error.message 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user._id); // Debug log
    
    const user = await User.findById(req.user._id)
      .select('-password') // Exclude password
      .lean(); // Convert to plain JavaScript object
    
    if (!user) {
      console.log('User not found'); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user); // Debug log
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};

// Get specific user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    // Validate ID before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .lean();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile', 
      error: error.message 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phoneno, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneno = phoneno || user.phoneno;
    user.address = address || user.address;

    await user.save();

    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getFullProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's borrowing history
    const borrowHistory = await BookActivity.find({ 
      userId: userId,
      type: { $in: ['issue', 'return'] }
    })
    .populate('bookId', 'title author isbn')
    .sort({ timestamp: -1 });

    const fullProfile = {
      ...user.toObject(),
      borrowHistory: borrowHistory.map(activity => ({
        bookTitle: activity.bookId.title,
        bookAuthor: activity.bookId.author,
        isbn: activity.bookId.isbn,
        type: activity.type,
        timestamp: activity.timestamp
      }))
    };

    res.json(fullProfile);
  } catch (error) {
    console.error('Error fetching full profile:', error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching activities for userId:', userId); // Debug log

    // Get activities and populate book details
    const activities = await BookActivity.find({ userId })
      .populate('bookId', 'title isbn call_no author')
      .sort({ timestamp: -1 });

    // Map activities and handle null bookId
    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      type: activity.type,
      timestamp: activity.timestamp,
      fine: activity.fine,
      book: activity.bookId ? {
        title: activity.bookId.title,
        isbn: activity.bookId.isbn,
        call_no: activity.bookId.call_no,
        author: activity.bookId.author
      } : {
        title: 'Book Removed',
        isbn: 'N/A',
        call_no: 'N/A',
        author: 'N/A'
      }
    }));

    console.log('Formatted activities:', formattedActivities); // Debug log
    res.json(formattedActivities);

  } catch (error) {
    console.error('Error in getUserActivities:', error);
    res.status(500).json({ 
      message: 'Error fetching user activities',
      error: error.message 
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email notification to user about status change
    try {
      const emailSubject = `Account ${status === 'Active' ? 'Activated' : 'Deactivated'}`;
      const emailBody = `
        <h2>Account Status Update</h2>
        <p>Dear ${user.name},</p>
        <p>Your library account has been ${status === 'Active' ? 'activated' : 'deactivated'}.</p>
        ${status === 'Deactive' ? '<p>Please contact the library staff for more information.</p>' : ''}
        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
      `;

      await sendEmail(user.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      message: 'Error updating user status',
      error: error.message
    });
  }
}; 