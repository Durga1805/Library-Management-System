// LIBRARY_MANAGEMENT_SYSTEM\backend\controllers\paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const createPaymentOrder = async (req, res) => {
  const { userId, bookId, amount } = req.body;

  if (!userId || !bookId || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${bookId}`,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment order', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
