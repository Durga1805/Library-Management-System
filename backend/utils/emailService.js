require('dotenv').config();
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify connection configuration
const verifyConnection = async () => {
    try {
        await transporter.verify();
        return true;
    } catch (error) {
        console.error('Email service error:', error);
        return false;
    }
};

// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Library Management System" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Function to Send Credentials Email
const sendCredentialEmail = async (to, name,role,userid, password) => {
    try {
        const info = await transporter.sendMail({
            from: `"Library Admin" <${process.env.SMTP_USER}>`,
            to,
            subject: "Library Account Credentials",
            text: `Hello ${name},\n\nYour ${role} account has been Succesfully created.\n\nYour Login Credentials:\nEmail: ${to} \nUserid:${userid}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nRegards,\nLibrary Management System`
        });

        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Add this new function
const sendBookIssuedEmail = async (userEmail, userName, bookTitle, dueDate) => {
    const subject = 'Book Issued Successfully';
    const html = `
        <h2>Book Issued Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>The book "${bookTitle}" has been issued to you.</p>
        <p>Due date: ${new Date(dueDate).toLocaleDateString()}</p>
        <p>Please return the book on time to avoid fines.</p>
        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
    `;
    return sendEmail(userEmail, subject, html);
};

// Add this new function
const sendBookReturnedEmail = async (userEmail, userName, bookTitle) => {
    const subject = 'Book Returned Successfully';
    const html = `
        <h2>Book Return Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>The book "${bookTitle}" has been returned successfully.</p>
        <p>Thank you for using our library services!</p>
        <br>
        <p>Best regards,</p>
        <p>Library Management System</p>
    `;
    return sendEmail(userEmail, subject, html);
};

// Add this to your existing email service
const sendDueDateReminder = async (userEmail, userName, bookDetails, daysRemaining) => {
  const subject = `Library Book Due in ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${daysRemaining <= 2 ? '#dc2626' : '#1f2937'};">Book Return Reminder</h2>
      <p>Dear ${userName},</p>
      
      <p style="font-weight: ${daysRemaining <= 2 ? 'bold' : 'normal'}; color: ${daysRemaining <= 2 ? '#dc2626' : '#1f2937'}">
        This is a reminder that the following book is due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}:
      </p>

      <div style="margin: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; background-color: #f9fafb;">
        <p><strong>Title:</strong> ${bookDetails.title}</p>
        <p><strong>Author:</strong> ${bookDetails.author}</p>
        <p><strong>Due Date:</strong> ${new Date(bookDetails.dueDate).toLocaleDateString()}</p>
        <p><strong>Call Number:</strong> ${bookDetails.call_no}</p>
      </div>

      ${daysRemaining <= 2 ? `
        <p style="color: #dc2626; font-weight: bold;">
          ⚠️ Please note: Late fees of ₹3 per day will be charged if the book is not returned by the due date.
        </p>
      ` : ''}

      <p>Please return the book on time to avoid any late fees.</p>
      <p>If you need more time, you can renew the book through your library account (subject to availability).</p>
      
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

  return sendEmail(userEmail, subject, html);
};

// Add this new function to emailService.js
const sendPaymentConfirmationEmail = async (userEmail, userName, bookDetails, paymentDetails) => {
  const subject = 'Payment Successful - Library Fine Paid';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Payment Successful!</h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937;">Payment Details:</h3>
        <p><strong>Book:</strong> ${bookDetails.title}</p>
        <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</p>
        <p><strong>Payment ID:</strong> ${paymentDetails.paymentId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #065f46; font-weight: bold;">Your book has been successfully returned.</p>
        <p>Thank you for clearing the fine. To avoid future fines, please note:</p>
        <ul style="color: #065f46;">
          <li>Return books before the due date</li>
          <li>Renew your books online if you need more time</li>
          <li>Keep track of due dates in your library account</li>
        </ul>
      </div>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #4b5563; font-size: 0.9em;">
          If you have any questions, please contact the library staff.
        </p>
        <p style="color: #4b5563; font-size: 0.9em;">
          This is an automated message, please do not reply.
        </p>
      </div>
    </div>
  `;

  return sendEmail(userEmail, subject, html);
};

// Export Functions
module.exports = {
    verifyConnection,
    sendEmail,
    sendCredentialEmail,
    sendBookIssuedEmail,
    sendBookReturnedEmail,
    sendDueDateReminder,
    sendPaymentConfirmationEmail
};

