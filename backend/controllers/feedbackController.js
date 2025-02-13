const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');

exports.createFeedback = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Create feedback form
    const feedback = new Feedback({
      title,
      description,
      dueDate,
      createdBy: req.user._id
    });

    await feedback.save();

    // Get all users except admin
    const users = await User.find({ 
      role: { $in: ['student', 'staff'] },
      status: 'Active'
    });

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title: 'New Feedback Form',
      message: `A new feedback form "${title}" has been created. Please submit your response by ${new Date(dueDate).toLocaleDateString()}.`,
      type: 'general'
    }));

    await Notification.insertMany(notifications);

    // Send emails to all users
    for (const user of users) {
      try {
        await sendEmail(
          user.email,
          'New Library Feedback Form',
          `
          <h2>New Feedback Form</h2>
          <p>Dear ${user.name},</p>
          <p>A new feedback form has been created and your response is requested.</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          <p>Please login to your dashboard to submit your feedback.</p>
          <br>
          <p>Best regards,</p>
          <p>Library Management System</p>
          `
        );
      } catch (emailError) {
        console.error('Error sending email to:', user.email, emailError);
      }
    }

    res.status(201).json({
      message: 'Feedback form created and notifications sent successfully',
      feedback
    });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      message: 'Error creating feedback form',
      error: error.message
    });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedbacks',
      error: error.message
    });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('responses.userId', 'name email dept');
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

exports.submitResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.status === 'closed') {
      return res.status(400).json({ message: 'This feedback form is closed' });
    }

    // Check if user has already submitted
    const existingResponse = feedback.responses.find(
      r => r.userId.toString() === req.user._id.toString()
    );

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted your response' });
    }

    feedback.responses.push({
      userId: req.user._id,
      answers,
      submittedAt: new Date()
    });

    await feedback.save();

    res.json({
      message: 'Feedback response submitted successfully',
      feedback
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error submitting feedback response',
      error: error.message
    });
  }
}; 