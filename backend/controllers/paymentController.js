const Razorpay = require('razorpay');
const crypto = require('crypto');
const Book = require('../models/Book');
const Payment = require('../models/Payment');
const { sendEmail } = require('../utils/emailService');
const emailService = require('../utils/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { bookId, paymentId, orderId, signature, amount } = req.body;

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      // Get book details first
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Save payment record
      const payment = new Payment({
        bookId,
        userId: req.user._id,
        amount,
        paymentId,
        orderId
      });
      await payment.save();

      // Update book status
      await Book.findByIdAndUpdate(bookId, {
        status: 'Available',
        issuedTo: null,
        issuedAt: null,
        dueDate: null,
        fine: 0
      });

      // Send payment confirmation email
      try {
        await emailService.sendPaymentConfirmationEmail(
          req.user.email,
          req.user.name,
          book,
          {
            amount: amount/100,
            paymentId,
            date: new Date()
          }
        );
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
      }

      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Add this new method to get payments with populated data
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bookId', 'title')
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments' });
  }
}; 