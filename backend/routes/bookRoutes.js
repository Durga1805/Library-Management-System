const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const bookRequestController = require('../controllers/bookRequestController');
const auth = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

router.post('/upload', bookController.uploadBooks);
router.get('/csv-template', bookController.getCSVTemplate);
router.get('/all', bookController.getAllBooks);
router.post('/reserve/:bookId', auth, bookController.reserveBook);
router.post('/cancel-reservation/:bookId', auth, bookController.cancelReservation);
router.get('/my-books', auth, bookController.getMyBooks);
router.post('/return/:bookId', auth, bookController.returnBook);
router.post('/pay-fine/:bookId', auth, bookController.payFine);
router.get('/statistics', auth, bookController.getStatistics);
router.get('/recent-activities', auth, bookController.getRecentActivities);
router.get('/reservations', auth, bookController.getReservations);
router.post('/issue/:bookId', auth, bookController.issueBook);
router.get('/issued-books', auth, bookController.getIssuedBooks);
router.get('/staff-activities/:staffId', auth, bookController.getStaffActivities);
router.get('/user-activities/:userId', auth, bookController.getUserActivities);
router.get('/guest', bookController.getGuestBooks);

// Book request routes
router.post('/request', auth, bookRequestController.createRequest);
router.get('/request/my-requests', auth, bookRequestController.getUserRequests);
router.get('/request/all', auth, bookRequestController.getAllRequests);
router.put('/request/:id/status', auth, bookRequestController.updateRequestStatus);

// Add this to your existing routes
router.get('/recommendations', auth, recommendationController.getRecommendedBooks);

module.exports = router; 