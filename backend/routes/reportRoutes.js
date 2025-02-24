const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/statistics', auth, reportController.getStatistics);
router.get('/user-activities', auth, reportController.getUserActivities);
router.get('/fine-payments', auth, reportController.getFinePayments);

module.exports = router; 