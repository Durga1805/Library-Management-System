const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

router.post('/', auth, feedbackController.createFeedback);
router.get('/', auth, feedbackController.getAllFeedbacks);
router.get('/:id', auth, feedbackController.getFeedbackById);
router.post('/:id/submit', auth, feedbackController.submitResponse);

module.exports = router; 