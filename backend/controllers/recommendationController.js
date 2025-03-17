// D:\Library-Management-System\backend\controllers\recommendationController.js
const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');
const BookRequest = require('../models/BookRequest');
const recommendationService = require('../services/recommendationService');

exports.getRecommendedBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const userDept = req.user.dept;

    console.log('Getting recommendations for:', {
      userId,
      userRole,
      userDept
    });

    // Check if user can borrow books
    const currentBorrowings = await BookActivity.find({
      userId,
      type: 'issue',
      returnDate: null
    });

    const canBorrow = currentBorrowings.length < (userRole === 'staff' ? 4 : 2);
    console.log('Can borrow:', canBorrow);

    // Get recommendations
    const recommendations = await recommendationService.getRecommendations(
      userId,
      userRole,
      userDept,
      canBorrow
    );

    console.log('Found recommendations:', recommendations.length);

    // If no personalized recommendations, get popular books
    if (!recommendations || recommendations.length === 0) {
      console.log('No recommendations found, getting popular books');
      const popularBooks = await recommendationService.getMostPopularBooks(userRole, userDept);
      return res.json(popularBooks);
    }

    res.json(recommendations);

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      message: 'Error getting book recommendations',
      error: error.message
    });
  }
};

// Add periodic model training
setInterval(async () => {
  try {
    await recommendationService.trainModel();
    console.log('ML model retrained successfully');
  } catch (error) {
    console.error('Error retraining ML model:', error);
  }
}, 24 * 60 * 60 * 1000); // Retrain daily 