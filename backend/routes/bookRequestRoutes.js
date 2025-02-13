const express = require('express');
const router = express.Router();
const bookRequestController = require('../controllers/bookRequestController');
const auth = require('../middleware/auth');

router.post('/', auth, bookRequestController.createRequest);
router.get('/my-requests', auth, bookRequestController.getUserRequests);
router.get('/all', auth, bookRequestController.getAllRequests);
router.put('/:id/status', auth, bookRequestController.updateRequestStatus);

module.exports = router; 