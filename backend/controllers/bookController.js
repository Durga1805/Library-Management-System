const Book = require('../models/Book');
const BookActivity = require('../models/BookActivity');
const User = require('../models/User');
const { sendBookIssuedEmail, sendBookReturnedEmail } = require('../utils/emailService');
const { createNotification } = require('./notificationController');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Get the next accession number
const getNextAccessionNo = async () => {
  const lastBook = await Book.findOne().sort({ accession_no: -1 });
  return lastBook ? lastBook.accession_no + 1 : 1;
};

// Add this constant for valid departments
const VALID_DEPARTMENTS = [
  'CSE',
  'IT',
  'MCA',
  'Mathematics',
  'Novel-ML',
  'Novel-EN',
  'Story-EN',
  'Story-ML',
  'Travelogue-ML',
  'Travelogue-EN',
  'Poem-ML',
  'Poem-EN',
  'Autobiography-ML',
  'Autobiography-EN'
];

// Upload books from CSV
exports.uploadBooks = async (req, res) => {
  try {
    const { books } = req.body;
    console.log('Received books data:', books);

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        message: 'Invalid data format',
        error: 'No valid data found in CSV'
      });
    }

    const processedBooks = [];
    const errors = [];
    let nextAccessionNo = await getNextAccessionNo();

    // Use VALID_DEPARTMENTS instead of schema path
    for (const book of books) {
      try {
        // Clean the data
        const cleanedBook = Object.keys(book).reduce((acc, key) => {
          acc[key] = typeof book[key] === 'string' ? book[key].trim() : book[key];
          return acc;
        }, {});

        // Validate required fields
        const requiredFields = [
          'title', 
          'author', 
          'publisher', 
          'isbn', 
          'year_of_publication',
          'no_of_pages', 
          'price', 
          'dept', 
          'cover_type'
        ];
        
        const missingFields = requiredFields.filter(field => !cleanedBook[field]);
        if (missingFields.length > 0) {
          errors.push(`Missing required fields: ${missingFields.join(', ')} for book: ${cleanedBook.title}`);
          continue;
        }

        // Validate department
        if (!VALID_DEPARTMENTS.includes(cleanedBook.dept)) {
          errors.push(`Invalid department "${cleanedBook.dept}" for book: ${cleanedBook.title}. Valid departments are: ${VALID_DEPARTMENTS.join(', ')}`);
          continue;
        }

        // Create multiple copies if specified
        const copies = parseInt(cleanedBook.copies) || 1;
        const call_no = `${cleanedBook.dept}-${cleanedBook.isbn}`;

        for (let i = 0; i < copies; i++) {
          const bookData = {
            title: cleanedBook.title,
            author: cleanedBook.author,
            publisher: cleanedBook.publisher,
            isbn: cleanedBook.isbn,
            year_of_publication: parseInt(cleanedBook.year_of_publication),
            no_of_pages: parseInt(cleanedBook.no_of_pages),
            price: parseFloat(cleanedBook.price),
            dept: cleanedBook.dept,
            cover_type: cleanedBook.cover_type,
            accession_no: nextAccessionNo++,
            call_no: call_no,
            status: 'Available',
            reserved: 'No'
          };

          processedBooks.push(bookData);
        }

      } catch (error) {
        console.error('Error processing book:', error);
        errors.push(`Error processing book: ${error.message}`);
      }
    }

    if (processedBooks.length === 0) {
      return res.status(400).json({
        message: 'No valid books to add',
        errors
      });
    }

    const result = await Book.insertMany(processedBooks);

    // Create notification for each new book
    try {
      for (const book of result) {
        await createNotification(book); // This will handle all user notifications
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
    }

    res.status(201).json({
      message: `Successfully added ${result.length} books`,
      errors: errors.length > 0 ? errors : undefined,
      books: result
    });

  } catch (error) {
    console.error('Error uploading books:', error);
    res.status(400).json({
      message: 'Error uploading books',
      error: error.message,
      details: error.errors
    });
  }
};

// Get CSV template
exports.getCSVTemplate = (req, res) => {
  const template = {
    headers: [
      'title',
      'author', 
      'publisher',
      'isbn',
      'year_of_publication',
      'no_of_pages',
      'price',
      'dept',
      'cover_type',
      'copies'
    ],
    sampleRow: {
      title: 'Sample Book',
      author: 'John Doe',
      publisher: 'Sample Publisher',
      isbn: '9780123456789',
      year_of_publication: '2023',
      no_of_pages: '200',
      price: '29.99',
      dept: 'CSE', // Can be CSE/IT/MCA/Mathematics/Novel-ML/etc.
      cover_type: 'Hardcover',
      copies: '1'
    }
  };
  
  // Add valid departments list to help users
  template.validDepartments = [
    'CSE',
    'IT',
    'MCA',
    'Mathematics',
    'Novel-ML',
    'Novel-EN',
    'Story-EN',
    'Story-ML',
    'Travelogue-ML',
    'Travelogue-EN',
    'Poem-ML',
    'Poem-EN',
    'Autobiography-ML',
    'Autobiography-EN'
  ];
  
  res.status(200).json(template);
};

// Add or update the search functionality in bookController.js
exports.getAllBooks = async (req, res) => {
  try {
    const { search, dept } = req.query;
    console.log('Search query:', search, 'Department:', dept); // Debug log

    let query = {};

    // Add search conditions
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
        { call_no: { $regex: search, $options: 'i' } }
      ];
    }

    // Add department filter
    if (dept && dept !== 'all') {
      query.dept = dept;
    }

    console.log('MongoDB query:', query); // Debug log

    const books = await Book.find(query);
    console.log(`Found ${books.length} books`); // Debug log

    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({
      message: 'Error searching books',
      error: error.message
    });
  }
};

exports.reserveBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;
    console.log('Reserving book:', bookId, 'for user:', userId);

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'Available') {
      return res.status(400).json({ message: 'Book is not available for reservation' });
    }

    // Update book status
    book.status = 'Reserved';
    book.reservedBy = userId;
    book.reservedAt = new Date();
    book.reserved = 'Yes';
    
    const savedBook = await book.save();
    
    // Create activity record
    const activity = new BookActivity({
      userId: userId,
      bookId: book._id,
      type: 'reserve',
      timestamp: new Date()
    });
    await activity.save();

    console.log('Book reserved successfully:', savedBook);

    res.json({ 
      message: 'Book reserved successfully',
      book: savedBook
    });

  } catch (error) {
    console.error('Error reserving book:', error);
    res.status(500).json({
      message: 'Error reserving book',
      error: error.message
    });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'Reserved' || !book.reservedBy || 
        book.reservedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot cancel this reservation' });
    }

    // Update book status to Available (not Active)
    book.status = 'Available';  // Changed from 'Active' to 'Available'
    book.reservedBy = null;
    book.reservedAt = null;
    book.reserved = 'No';
    
    await book.save();

    // Create activity record
    const activity = new BookActivity({
      userId: req.user._id,
      bookId: book._id,
      type: 'reserve',
      timestamp: new Date()
    });
    await activity.save();

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Error cancelling reservation' });
  }
};

// Get user's books
exports.getMyBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching books for user:', userId);

    const reservedBooks = await Book.find({
      reservedBy: userId,
      status: 'Reserved'
    });
    console.log('Reserved books found:', reservedBooks);

    const issuedBooks = await Book.find({
      issuedTo: userId,
      status: 'Issued'
    });
    console.log('Issued books found:', issuedBooks);

    res.json({
      reserved: reservedBooks,
      issued: issuedBooks
    });

  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({
      message: 'Error fetching your books',
      error: error.message
    });
  }
};

// Return book
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('issuedTo');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'Issued') {
      return res.status(400).json({ message: 'Book is not issued' });
    }

    // Calculate fine if book is overdue
    let fine = 0;
    if (book.dueDate && new Date(book.dueDate) < new Date()) {
      const daysOverdue = Math.ceil(
        (new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24)
      );
      fine = daysOverdue * 5; // ₹5 per day
    }

    // Store user details before updating book
    const user = book.issuedTo;
    const bookDetails = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      call_no: book.call_no,
      fine: fine
    };

    if (fine === 0) {
      // If no fine, complete return immediately
      book.status = 'Available';
      book.issuedTo = null;
      book.issuedAt = null;
      book.dueDate = null;
      await book.save();

      // Create return activity record
      const activity = new BookActivity({
        userId: user._id,
        bookId: book._id,
        type: 'return',
        fine: 0
      });
      await activity.save();

      // Send email notification
      await sendBookReturnedEmail(
        user.email,
        user.name,
        bookDetails
      );

      res.json({ 
        message: 'Book returned successfully',
        fine: 0 
      });
    } else {
      // If there's a fine, mark it but don't complete return
      book.fine = fine;
      await book.save();
      
      res.json({ 
        message: 'Book has pending fine',
        fine: fine,
        requiresPayment: true
      });
    }
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Error returning book' });
  }
};

// Pay fine
exports.payFine = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('issuedTo');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Store user details before updating book
    const user = book.issuedTo;
    const bookDetails = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      call_no: book.call_no,
      fine: book.fine
    };

    // Update book status
    book.status = 'Available';
    book.issuedTo = null;
    book.issuedAt = null;
    book.dueDate = null;
    const fine = book.fine;
    book.fine = 0;
    
    await book.save();

    // Create return activity record
    const activity = new BookActivity({
      userId: user._id,
      bookId: book._id,
      type: 'return',
      fine: fine
    });
    await activity.save();

    // Send email notification
    await sendBookReturnedEmail(
      user.email,
      user.name,
      bookDetails
    );

    res.json({ message: 'Fine paid and book returned successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const issuedBooks = await Book.countDocuments({ status: 'Issued' });
    const dueReturns = await Book.countDocuments({
      status: 'Issued',
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalBooks,
      issuedBooks,
      dueReturns
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await BookActivity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name')
      .populate('bookId', 'title');

    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      type: activity.type,
      description: `${activity.userId.name} ${activity.type}d "${activity.bookId.title}"`,
      timestamp: activity.timestamp
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching recent activities' });
  }
};

// Add these controller methods
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Book.find({ status: 'Reserved' })
      .populate('reservedBy', 'name userid dept')
      .sort({ reservedAt: -1 });

    const formattedReservations = reservations.map(book => ({
      _id: book._id,
      book: {
        _id: book._id,
        title: book.title,
        isbn: book.isbn,
        call_no: book.call_no
      },
      user: book.reservedBy,
      reservedAt: book.reservedAt
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (book.status !== 'Reserved' || book.reservedBy.toString() !== userId) {
      return res.status(400).json({ message: 'Book is not reserved by this user' });
    }

    // Update book status
    book.status = 'Issued';
    book.issuedTo = userId;
    book.issuedAt = new Date();
    book.dueDate = dueDate;
    book.reservedBy = null;
    book.reservedAt = null;
    
    await book.save();

    // Create activity record
    await BookActivity.create({
      userId,
      bookId: book._id,
      type: 'issue'
    });

    // Send email notification
    await sendBookIssuedEmail(
      user.email,
      user.name,
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        issuedDate: book.issuedAt,
        dueDate: book.dueDate,
        callNo: book.call_no
      }
    );

    res.json({ message: 'Book issued successfully', book });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ message: 'Error issuing book' });
  }
};

// Add this new controller method
exports.getIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await Book.find({ status: 'Issued' })
      .populate('issuedTo', 'name userid dept')
      .sort({ issuedAt: -1 });

    res.json(issuedBooks);
  } catch (error) {
    console.error('Error fetching issued books:', error);
    res.status(500).json({ message: 'Error fetching issued books' });
  }
};

// Add this new controller method
exports.getStaffActivities = async (req, res) => {
  try {
    const { staffId } = req.params;
    
    const activities = await BookActivity.find()
      .populate('bookId', 'title isbn call_no')
      .populate('userId', 'name userid dept')
      .sort({ timestamp: -1 });

    // Filter activities for the specific staff member
    const staffActivities = activities.filter(activity => 
      activity.userId._id.toString() === staffId
    );

    res.json(staffActivities);
  } catch (error) {
    console.error('Error fetching staff activities:', error);
    res.status(500).json({ 
      message: 'Error fetching activities',
      error: error.message 
    });
  }
};

// Add this controller method
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activities = await BookActivity.find({ userId })
      .populate('bookId', 'title author isbn call_no')
      .sort({ timestamp: -1 });

    // Add payment activities if any
    const payments = await Payment.find({ userId })
      .populate('bookId', 'title author isbn call_no')
      .sort({ timestamp: -1 });

    // Combine activities and payments
    const allActivities = [
      ...activities,
      ...payments.map(payment => ({
        ...payment.toObject(),
        type: 'payment',
        timestamp: payment.timestamp,
        fine: payment.amount
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(allActivities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ 
      message: 'Error fetching activities',
      error: error.message 
    });
  }
};

// Add this to your bookController.js
exports.getGuestBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .select('title author accession_no dept call_no status')
      .sort({ title: 1, accession_no: 1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};