// // backend/controllers/feedbackController.js
// const Feedback = require('../models/feedbackModel');

// // Submit feedback
// const submitFeedback = async (req, res) => {
//   try {
//     const { comment, rating } = req.body;
//     const userId = req.user._id;

//     const feedback = new Feedback({
//       userId,
//       comment,
//       rating,
//     });

//     await feedback.save();
//     res.status(201).json({ message: 'Feedback submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to submit feedback' });
//   }
// };

// // Get all feedback
// const getAllFeedback = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().populate('userId', 'name');
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch feedback' });
//   }
// };

// module.exports = { submitFeedback, getAllFeedback };
