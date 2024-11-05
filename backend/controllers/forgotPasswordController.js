// // LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\forgotPasswordController.js
// const crypto = require('crypto');
// const User = require('../models/User');
// const Staff = require('../models/Staff');


// // Generic function to handle forgot password
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if the user is from Staff or User model
//     let user;
//     if (req.path.includes('/staff')) {
//       user = await Staff.findOne({ email });
//     } else {
//       user = await User.findOne({ email });
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Generate a token
//     const token = crypto.randomBytes(20).toString('hex');

//     // Set token and expiration
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
//     await user.save();

//     res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
//   } catch (error) {
//     console.error('Error in forgot password:', error);
//     res.status(500).json({ success: false, message: 'Error sending reset email', error });
//   }
// };

// // Function to reset the password
// const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Check for user with the given reset token
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     }) || await Staff.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
//     }

//     // Hash the new password
//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({ success: true, message: 'Password has been reset successfully' });
//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).json({ success: false, message: 'Server error while resetting password' });
//   }
// };

// module.exports = { forgotPassword, resetPassword };

