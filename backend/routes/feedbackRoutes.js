const express = require('express');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// Route to get all feedback
router.get('/feedback', feedbackController.getAllFeedback);

// Route to add feedback
router.post('/feedback', feedbackController.addFeedback);

module.exports = router;
