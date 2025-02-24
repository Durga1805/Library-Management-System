const User = require('../models/User');
const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');
const Payment = require('../models/Payment');
const { calculateFine } = require('../utils/fineCalculator');

exports.getStatistics = async (req, res) => {
  try {
    // Get all active fines
    const booksWithFines = await Book.find({
      status: 'Issued',
      dueDate: { $lt: new Date() }
    });

    const currentFines = booksWithFines.reduce((total, book) => {
      return total + calculateFine(book.dueDate);
    }, 0);

    // Get all paid fines
    const paidFines = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalFines = currentFines + (paidFines[0]?.total || 0);

    // Rest of your statistics...
    const statistics = {
      totalUsers: await User.countDocuments(),
      totalBooks: await Book.countDocuments(),
      activeLoans: await Book.countDocuments({ status: 'Issued' }),
      overdueBooks: booksWithFines.length,
      totalFines: totalFines
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Error getting statistics' });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const users = await User.find();
    const userReports = [];

    for (const user of users) {
      // Get current loans
      const currentLoans = await Book.find({
        issuedTo: user._id,
        status: 'Issued'
      });

      // Calculate current fines
      const currentFines = currentLoans.reduce((total, book) => {
        if (book.dueDate < new Date()) {
          return total + calculateFine(book.dueDate);
        }
        return total;
      }, 0);

      // Get paid fines
      const paidFines = await Payment.aggregate([
        {
          $match: { userId: user._id }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      // Get total borrowed books
      const totalBorrowed = await BookActivity.countDocuments({
        userId: user._id,
        type: 'issue'
      });

      userReports.push({
        _id: user._id,
        name: user.name,
        userid: user.userid,
        dept: user.dept,
        totalBorrowed,
        currentLoans: currentLoans.length,
        overdueBooks: currentLoans.filter(book => book.dueDate < new Date()),
        totalFines: currentFines + (paidFines[0]?.total || 0)
      });
    }

    res.json(userReports);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

exports.getFinePayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bookId', 'title')
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    const formattedPayments = payments.map(payment => ({
      _id: payment._id,
      bookTitle: payment.bookId?.title || 'N/A',
      userId: payment.userId,
      amount: payment.amount,
      timestamp: payment.timestamp,
      status: payment.status,
      paymentMethod: payment.paymentMethod
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching fine payments:', error);
    res.status(500).json({ message: 'Error fetching fine payments' });
  }
}; 