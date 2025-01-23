//LIBRARY_MANAGEMENT_SYSTEM\backend\routes\paymentRoutes.js
const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const router = express.Router();

// Route to create a Razorpay order
router.post('/', createPaymentOrder);

// Route to verify the payment
router.post('/verify', verifyPayment);

module.exports = router;
