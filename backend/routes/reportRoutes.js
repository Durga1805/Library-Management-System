const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/statistics', auth, reportController.getStatistics);
router.get('/user-activities', auth, reportController.getUserActivities);

module.exports = router; 