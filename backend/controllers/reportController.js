const User = require('../models/User');
const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');

exports.getStatistics = async (req, res) => {
  try {
    console.log('Fetching statistics...');
    
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    console.log('Total users:', totalUsers);
    
    const totalBooks = await Book.countDocuments();
    console.log('Total books:', totalBooks);
    
    const activeLoans = await Book.countDocuments({ status: 'Issued' });
    console.log('Active loans:', activeLoans);
    
    const currentDate = new Date();
    const overdueBooks = await Book.countDocuments({
      status: 'Issued',
      dueDate: { $lt: currentDate }
    });
    console.log('Overdue books:', overdueBooks);

    const overdueItems = await Book.find({
      status: 'Issued',
      dueDate: { $lt: currentDate }
    }).populate('issuedTo');
    console.log('Overdue items:', overdueItems);

    let totalFines = 0;
    overdueItems.forEach(book => {
      const dueDate = new Date(book.dueDate);
      const daysOverdue = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      totalFines += daysOverdue * 5;
    });
    console.log('Total fines:', totalFines);

    res.json({
      totalUsers,
      totalBooks,
      activeLoans,
      overdueBooks,
      totalFines
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { range } = req.query;
    const currentDate = new Date();
    let startDate = new Date();

    // Calculate date range
    switch (range) {
      case 'week':
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time for 'all'
    }

    // Get all non-admin users
    const users = await User.find({ role: { $ne: 'admin' } });

    const userReports = await Promise.all(users.map(async user => {
      // Get user's book activities
      const activities = await BookActivity.find({
        userId: user._id,
        timestamp: { $gte: startDate }
      }).populate('bookId');

      // Get current loans
      const currentLoans = await Book.find({
        issuedTo: user._id,
        status: 'Issued'
      });

      // Calculate overdue books and fines
      const overdueBooks = currentLoans
        .filter(book => new Date(book.dueDate) < currentDate)
        .map(book => {
          const daysOverdue = Math.ceil((currentDate - new Date(book.dueDate)) / (1000 * 60 * 60 * 24));
          return {
            title: book.title,
            dueDate: book.dueDate,
            daysOverdue,
            fineAmount: daysOverdue * 5
          };
        });

      // Calculate total fines
      const totalFines = overdueBooks.reduce((sum, book) => sum + book.fineAmount, 0);

      return {
        _id: user._id,
        userid: user.userid,
        name: user.name,
        dept: user.dept,
        totalBorrowed: activities.filter(a => a.type === 'issue').length,
        currentLoans: currentLoans.length,
        overdueBooks,
        totalFines,
        paidFines: user.paidFines || 0
      };
    }));

    res.json(userReports);
  } catch (error) {
    console.error('Error generating user activities report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
}; 