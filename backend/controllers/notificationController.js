const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createNotification = async (bookData, userId = null) => {
  try {
    // If userId is not provided, we'll create notifications for all students and staff
    if (!userId) {
      const users = await User.find({
        role: { $in: ['student', 'staff'] }
      });
      
      const notifications = users.map(user => ({
        userId: user._id,
        title: 'New Book Added',
        message: `A new book "${bookData.title}" by ${bookData.author} has been added to the library.`,
        type: 'new_book'
      }));

      await Notification.insertMany(notifications);
      return notifications;
    }

    // If userId is provided, create notification for specific user
    const notification = new Notification({
      userId,
      title: 'New Book Added',
      message: `A new book "${bookData.title}" by ${bookData.author} has been added to the library.`,
      type: 'new_book'
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.user._id 
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating notification',
      error: error.message
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating notifications',
      error: error.message
    });
  }
}; 