const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { emailOrUserid, password } = req.body;
    console.log('Login attempt for:', emailOrUserid);

    // Find user by email or userid
    const user = await User.findOne({
      $or: [
        { email: emailOrUserid },
        { userid: emailOrUserid }
      ]
    });
    

    console.log('User found:', user ? {
      id: user._id,
      role: user.role,
      dept: user.dept,
      status: user.status
    } : 'No user found');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email/userid or password'
      });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(401).json({
        message: 'Your account is deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email/userid or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        dept: user.dept 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with all necessary data
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      dept: user.dept,
      redirect: user.role === 'student' ? '/userpage' : 
               user.role === 'staff' && user.dept === 'Library' ? '/libstaffpage' :
               user.role === 'staff' ? '/staffpage' :
               user.role === 'admin' ? '/adminpage' : '/'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}; 