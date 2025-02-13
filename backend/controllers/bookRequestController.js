const BookRequest = require('../models/BookRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');

exports.createRequest = async (req, res) => {
  try {
    const { title, author, publisher, year, description, reason } = req.body;
    
    const bookRequest = new BookRequest({
      title,
      author,
      publisher,
      year,
      description,
      reason,
      requestedBy: req.user._id
    });

    await bookRequest.save();

    res.status(201).json({
      message: 'Book request submitted successfully',
      request: bookRequest
    });
  } catch (error) {
    console.error('Error creating book request:', error);
    res.status(500).json({
      message: 'Error submitting book request',
      error: error.message
    });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ requestedBy: req.user._id })
      .sort({ requestDate: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching requests',
      error: error.message
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate('requestedBy', 'name email dept')
      .sort({ requestDate: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching requests',
      error: error.message
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const request = await BookRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminResponse,
        responseDate: Date.now()
      },
      { new: true }
    ).populate('requestedBy');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create notification for the user
    const notification = new Notification({
      userId: request.requestedBy._id,
      title: 'Book Request Update',
      message: `Your request for "${request.title}" has been ${status}. ${adminResponse ? `Admin response: ${adminResponse}` : ''}`,
      type: 'book_request'
    });

    await notification.save();

    // Send email if request is approved
    if (status === 'approved') {
      const emailSubject = 'Book Request Approved';
      const emailBody = `
        <h2>Your Book Request has been Approved!</h2>
        <p>Dear ${request.requestedBy.name},</p>
        <p>Your request for the book "${request.title}" by ${request.author} has been approved.</p>
        <p><strong>Book Details:</strong></p>
        <ul>
          <li>Title: ${request.title}</li>
          <li>Author: ${request.author}</li>
          ${request.publisher ? `<li>Publisher: ${request.publisher}</li>` : ''}
          ${request.year ? `<li>Year: ${request.year}</li>` : ''}
        </ul>
        ${adminResponse ? `<p><strong>Librarian's Response:</strong> ${adminResponse}</p>` : ''}
        <p>You can now visit the library to reserve this book.</p>
        <p>Please note that book reservations are held for 48 hours.</p>
        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
      `;

      try {
        await sendEmail(
          request.requestedBy.email,
          emailSubject,
          emailBody
        );
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't throw error here as the request update was successful
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating request',
      error: error.message
    });
  }
}; 