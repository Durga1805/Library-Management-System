const Feedback = require('../models/feedbackModel');

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new feedback
exports.addFeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const feedback = new Feedback({ comment, rating });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
