const Book = require('../models/Book');
const { sendEmail, sendDueDateReminder } = require('../utils/emailService');

class ReminderService {
  async sendDueDateReminders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all issued books that are due within the next 5 days or today
      const issuedBooks = await Book.find({
        status: 'Issued',
        dueDate: {
          $gte: today,
          $lte: new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)) // 5 days from now
        }
      }).populate('issuedTo');

      console.log(`Found ${issuedBooks.length} books for reminder check`);

      for (const book of issuedBooks) {
        const dueDate = new Date(book.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        // Calculate days until due
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        try {
          if (book.issuedTo && book.issuedTo.email) {
            // Send different types of reminders based on days remaining
            if (daysUntilDue === 0) {
              // Due today - send urgent reminder
              await this.sendUrgentDueTodayEmail(book);
              console.log(`Urgent reminder sent for book due TODAY: ${book.title}`);
            } else if (daysUntilDue <= 5) {
              // Regular reminder with appropriate urgency level
              await this.sendDailyReminder(book, daysUntilDue);
              console.log(`${daysUntilDue}-day reminder sent for: ${book.title}`);
            }
          }
        } catch (error) {
          console.error(`Error sending reminder for book ${book.title}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in reminder service:', error);
    }
  }

  async sendDailyReminder(book, daysUntilDue) {
    // Customize message based on days remaining
    const urgencyLevel = this.getUrgencyLevel(daysUntilDue);
    const subject = `${urgencyLevel.emoji} Library Book Due in ${daysUntilDue} Day${daysUntilDue > 1 ? 's' : ''}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${urgencyLevel.color};">Book Return Reminder</h2>
        <p>Dear ${book.issuedTo.name},</p>
        
        <p style="font-weight: bold; color: ${urgencyLevel.color}">
          ${urgencyLevel.emoji} Your book is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}!
        </p>

        <div style="margin: 20px; padding: 15px; border: 2px solid ${urgencyLevel.color}; border-radius: 5px; background-color: ${urgencyLevel.bgColor};">
          <p><strong>Title:</strong> ${book.title}</p>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Due Date:</strong> ${new Date(book.dueDate).toLocaleDateString()}</p>
          <p><strong>Call Number:</strong> ${book.call_no}</p>
        </div>

        ${this.getUrgencyMessage(daysUntilDue)}

        <p>If you need more time, please renew the book through your library account (subject to availability).</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 0.9em;">
            If you have already returned the book, please ignore this reminder.
          </p>
        </div>

        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
      </div>
    `;

    await sendEmail(book.issuedTo.email, subject, html);
  }

  getUrgencyLevel(daysUntilDue) {
    switch (daysUntilDue) {
      case 1:
        return {
          emoji: '⚠️',
          color: '#dc2626', // red
          bgColor: '#fef2f2'
        };
      case 2:
        return {
          emoji: '⚠️',
          color: '#ea580c', // orange
          bgColor: '#fff7ed'
        };
      case 3:
        return {
          emoji: '⚡',
          color: '#ca8a04', // yellow
          bgColor: '#fefce8'
        };
      case 4:
        return {
          emoji: '📢',
          color: '#0284c7', // blue
          bgColor: '#f0f9ff'
        };
      case 5:
        return {
          emoji: '📚',
          color: '#059669', // green
          bgColor: '#f0fdf4'
        };
      default:
        return {
          emoji: '📚',
          color: '#1f2937', // gray
          bgColor: '#f9fafb'
        };
    }
  }

  getUrgencyMessage(daysUntilDue) {
    if (daysUntilDue <= 2) {
      return `
        <p style="color: #dc2626; font-weight: bold;">
          ⚠️ IMPORTANT: Late fees of ₹3 per day will be charged if the book is not returned by the due date.
        </p>
      `;
    } else if (daysUntilDue <= 3) {
      return `
        <p style="color: #ca8a04; font-weight: bold;">
          Please ensure to return the book on time to avoid late fees.
        </p>
      `;
    }
    return `
      <p>Please return the book on time to avoid any late fees.</p>
    `;
  }

  async sendUrgentDueTodayEmail(book) {
    const subject = `⚠️ URGENT: Library Book Due Today`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">URGENT: Book Due Today</h2>
        <p>Dear ${book.issuedTo.name},</p>
        <p style="color: #dc2626; font-weight: bold;">This is an urgent reminder that the following book is due TODAY:</p>
        <div style="margin: 20px; padding: 15px; border: 2px solid #dc2626; border-radius: 5px; background-color: #fef2f2;">
          <p><strong>Title:</strong> ${book.title}</p>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Due Date:</strong> ${new Date(book.dueDate).toLocaleDateString()}</p>
          <p><strong>Call Number:</strong> ${book.call_no}</p>
        </div>
        <p style="font-weight: bold;">Please return the book today to avoid late fees.</p>
        <p style="color: #dc2626; font-weight: bold;">
          ⚠️ Late fees of ₹3 per day will be charged starting tomorrow.
        </p>
        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
      </div>
    `;

    await sendEmail(book.issuedTo.email, subject, html);
  }
}

module.exports = new ReminderService(); 