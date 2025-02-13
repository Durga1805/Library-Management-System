// backend\services\recommendationService.js
const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');
const User = require('../models/User');

class RecommendationService {
  constructor() {
    this.model = null;
    this.userEncoder = new Map();
    this.bookEncoder = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.buildModel();
      await this.trainModel();
      this.initialized = true;
    }
  }

  async buildModel() {
    // Create the ANN model
    this.model = tf.sequential();
    
    // Add layers
    this.model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [5] // [department, author, popularity, rating, availability]
    }));
    
    this.model.add(tf.layers.dropout(0.2));
    
    this.model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    this.model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    // Compile model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async trainModel() {
    try {
      // Get training data
      const activities = await BookActivity.find()
        .populate('bookId')
        .populate('userId');

      // Prepare data for training
      const trainingData = [];
      const labels = [];

      activities.forEach(activity => {
        if (activity.bookId && activity.userId) {
          // Create feature vector
          const features = [
            this.encodeDepartment(activity.bookId.dept),
            this.encodeAuthor(activity.bookId.author),
            this.calculatePopularity(activity.bookId._id, activities),
            activity.type === 'return' ? 1 : 0.5,
            activity.bookId.status === 'Available' ? 1 : 0
          ];

          trainingData.push(features);
          labels.push(activity.type === 'return' ? 1 : 0.5);
        }
      });

      // Convert to tensors
      const xs = tf.tensor2d(trainingData);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      // Train model
      await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

    } catch (error) {
      console.error('Error training model:', error);
    }
  }

  async getRecommendations(userId, userRole, userDept, canBorrow = true) {
    try {
      // If user can't borrow, return popular books
      if (!canBorrow) {
        return this.getMostPopularBooks(userRole, userDept);
      }

      // Get user's reading history
      const userHistory = await BookActivity.find({ 
        userId,
        type: { $in: ['issue', 'return'] }
      }).populate('bookId');

      // Extract preferences
      const preferences = {
        departments: new Set(),
        authors: new Set(),
        readBooks: new Set()
      };

      userHistory.forEach(activity => {
        if (activity.bookId) {
          preferences.departments.add(activity.bookId.dept);
          preferences.authors.add(activity.bookId.author);
          preferences.readBooks.add(activity.bookId.title);
        }
      });

      // Add department preferences for staff
      if (userRole === 'staff') {
        preferences.departments.add(userDept);
        if (['CSE', 'IT', 'MCA'].includes(userDept)) {
          preferences.departments.add('CSE');
          preferences.departments.add('IT');
          preferences.departments.add('MCA');
        }
      }

      // Get recommendations using weighted scoring
      const recommendations = await Book.aggregate([
        {
          $match: {
            status: 'Available',
            title: { $nin: Array.from(preferences.readBooks) }
          }
        },
        {
          $addFields: {
            score: {
              $sum: [
                {
                  $cond: [
                    { $in: ['$dept', Array.from(preferences.departments)] },
                    3,
                    0
                  ]
                },
                {
                  $cond: [
                    { $in: ['$author', Array.from(preferences.authors)] },
                    2,
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$title',
            book: { $first: '$$ROOT' },
            score: { $first: '$score' }
          }
        },
        { $sort: { score: -1 } },
        { $limit: 2 }
      ]);

      return recommendations.map(r => r.book);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getMostPopularBooks(userRole, userDept);
    }
  }

  // Helper methods
  encodeDepartment(dept) {
    const deptMap = {
      'CSE': 0, 'IT': 0.2, 'MCA': 0.4, 'Mathematics': 0.6,
      'Novel-ML': 0.8, 'Novel-EN': 1
    };
    return deptMap[dept] || 0;
  }

  encodeAuthor(author) {
    if (!this.authorEncoder) {
      this.authorEncoder = new Map();
    }
    if (!this.authorEncoder.has(author)) {
      this.authorEncoder.set(author, this.authorEncoder.size / 100);
    }
    return this.authorEncoder.get(author);
  }

  async calculatePopularity(bookId, activities = null) {
    if (!activities) {
      activities = await BookActivity.find({ bookId });
    }
    const count = activities.filter(a => a.bookId.toString() === bookId.toString()).length;
    return Math.min(count / 10, 1); // Normalize to 0-1
  }

  async getMostPopularBooks(userRole, userDept) {
    try {
      console.log('Getting popular books for:', { userRole, userDept });

      const query = userRole === 'staff' ? { 'book.dept': userDept } : {};
      
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
            _id: '$book.title',
            count: { $sum: 1 },
            book: { $first: '$book' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 2 }
      ]);

      console.log('Found popular books:', popularBooks.length);

      // If no popular books found, get any available books
      if (popularBooks.length === 0) {
        console.log('No popular books found, getting any available books');
        const availableBooks = await Book.aggregate([
          {
            $match: {
              status: 'Available',
              ...(userRole === 'staff' ? { dept: userDept } : {})
            }
          },
          {
            $group: {
              _id: '$title',
              book: { $first: '$$ROOT' }
            }
          },
          { $limit: 2 }
        ]);

        return availableBooks.map(item => item.book);
      }

      return popularBooks.map(item => item.book);
    } catch (error) {
      console.error('Error getting popular books:', error);
      return [];
    }
  }
}

module.exports = new RecommendationService(); 
