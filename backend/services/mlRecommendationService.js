// backend\services\mlRecommendationService.js
const tf = require('@tensorflow/tfjs');
const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');
const User = require('../models/User');

class MLRecommendationService {
  constructor() {
    this.model = null;
    this.userEncoder = new Map();
    this.bookEncoder = new Map();
    this.bookFeatures = new Map();
  }

  // Prepare data for training
  async prepareData() {
    // Get all activities
    const activities = await BookActivity.find()
      .populate('userId')
      .populate('bookId');

    // Create user and book encodings
    activities.forEach(activity => {
      if (!this.userEncoder.has(activity.userId._id.toString())) {
        this.userEncoder.set(activity.userId._id.toString(), this.userEncoder.size);
      }
      if (!this.bookEncoder.has(activity.bookId._id.toString())) {
        this.bookEncoder.set(activity.bookId._id.toString(), this.bookEncoder.size);
      }
    });

    // Create book features
    const books = await Book.find();
    books.forEach(book => {
      this.bookFeatures.set(book._id.toString(), {
        dept: book.dept,
        author: book.author,
        popularity: 0
      });
    });

    // Calculate book popularity
    activities.forEach(activity => {
      const bookId = activity.bookId._id.toString();
      const features = this.bookFeatures.get(bookId);
      if (features) {
        features.popularity += 1;
      }
    });

    return activities;
  }

  // Train the model
  async trainModel() {
    const activities = await this.prepareData();
    
    // Prepare training data
    const trainingData = activities.map(activity => ({
      userId: this.userEncoder.get(activity.userId._id.toString()),
      bookId: this.bookEncoder.get(activity.bookId._id.toString()),
      rating: activity.type === 'return' ? 1 : 0.5 // Higher weight for completed reads
    }));

    // Create and train the model
    this.model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: this.userEncoder.size,
          outputDim: 50,
          inputLength: 1
        }),
        tf.layers.flatten(),
        tf.layers.dense({ units: 100, activation: 'relu' }),
        tf.layers.dense({ units: this.bookEncoder.size, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Convert data to tensors
    const userIds = tf.tensor2d(trainingData.map(d => [d.userId]));
    const ratings = tf.tensor2d(trainingData.map(d => Array(this.bookEncoder.size).fill(0)
      .map((_, i) => i === d.bookId ? d.rating : 0)));

    // Train the model
    await this.model.fit(userIds, ratings, {
      epochs: 10,
      batchSize: 32
    });
  }

  // Get recommendations for a user
  async getRecommendations(userId, userRole, userDept, canBorrow = true) {
    try {
      // If user can't borrow, return most popular books
      if (!canBorrow) {
        return this.getMostPopularBooks(userRole, userDept);
      }

      const encodedUserId = this.userEncoder.get(userId.toString());
      if (!encodedUserId) {
        return this.getContentBasedRecommendations(userRole, userDept);
      }

      // Get model predictions
      const userTensor = tf.tensor2d([[encodedUserId]]);
      const predictions = this.model.predict(userTensor);
      const scores = await predictions.array();

      // Convert predictions to recommendations
      const recommendations = [];
      const scoreArray = scores[0].map((score, index) => ({
        bookId: this.getBookIdByIndex(index),
        score
      }));

      // Sort by score and get top recommendations
      scoreArray.sort((a, b) => b.score - a.score);

      // Get available books
      const availableBooks = await Book.find({ status: 'Available' });
      const availableBookIds = new Set(availableBooks.map(b => b._id.toString()));

      // Filter and enhance recommendations
      for (const item of scoreArray) {
        if (availableBookIds.has(item.bookId)) {
          const book = availableBooks.find(b => b._id.toString() === item.bookId);
          if (book) {
            recommendations.push(book);
            if (recommendations.length >= 2) break;
          }
        }
      }

      return recommendations;
    } catch (error) {
      console.error('ML Recommendation error:', error);
      return this.getMostPopularBooks(userRole, userDept);
    }
  }

  // Get most popular books (fallback method)
  async getMostPopularBooks(userRole, userDept) {
    const query = userRole === 'staff' ? { dept: userDept } : {};
    
    const popularBooks = await BookActivity.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      },
      { $unwind: '$book' },
      {
        $match: {
          'book.status': 'Available',
          ...query
        }
      },
      {
        $group: {
          _id: '$bookId',
          count: { $sum: 1 },
          book: { $first: '$book' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 2 }
    ]);

    return popularBooks.map(item => item.book);
  }

  // Helper method to get book ID from index
  getBookIdByIndex(index) {
    for (const [id, idx] of this.bookEncoder) {
      if (idx === index) return id;
    }
    return null;
  }
}

module.exports = new MLRecommendationService(); 