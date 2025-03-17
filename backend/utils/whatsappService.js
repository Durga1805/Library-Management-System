require('dotenv').config();
const axios = require('axios');

// WhatsApp message sender configuration
const sendWhatsAppMessage = async (to, text) => {
  try {
    const data = {
      "messaging_product": "whatsapp",
      "preview_url": false,
      "recipient_type": "individual",
      "to": to,
      "type": "text",
      "text": {
        "body": text
      }
    };

    const config = {
      method: 'post',
      url: `https://graph.facebook.com/${process.env.WHATSAPP_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    };

    const response = await axios(config);
    console.log('WhatsApp message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

// Book Issued WhatsApp Message
const sendBookIssuedWhatsApp = async (phoneNumber, userName, bookTitle, dueDate) => {
  const message = `Dear ${userName},\n\nThe book "${bookTitle}" has been issued to you.\nDue date: ${new Date(dueDate).toLocaleDateString()}\n\nPlease return the book on time to avoid fines.\n\nBest regards,\nLibrary Management System`;
  return sendWhatsAppMessage(phoneNumber, message);
};

// Book Returned WhatsApp Message
const sendBookReturnedWhatsApp = async (phoneNumber, userName, bookTitle) => {
  const message = `Dear ${userName},\n\nThe book "${bookTitle}" has been returned successfully.\nThank you for using our library services!\n\nBest regards,\nLibrary Management System`;
  return sendWhatsAppMessage(phoneNumber, message);
};

// Due Date Reminder WhatsApp Message
const sendDueDateReminderWhatsApp = async (phoneNumber, userName, bookDetails, daysRemaining) => {
  const message = `Dear ${userName},\n\nThis is a reminder that the following book is due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}:\n\nTitle: ${bookDetails.title}\nAuthor: ${bookDetails.author}\nDue Date: ${new Date(bookDetails.dueDate).toLocaleDateString()}\nCall Number: ${bookDetails.call_no}\n\n${daysRemaining <= 2 ? '⚠️ Please note: Late fees of ₹3 per day will be charged if the book is not returned by the due date.\n\n' : ''}Please return the book on time to avoid any late fees.\n\nBest regards,\nLibrary Management System`;
  return sendWhatsAppMessage(phoneNumber, message);
};

// Payment Confirmation WhatsApp Message
const sendPaymentConfirmationWhatsApp = async (phoneNumber, userName, bookDetails, paymentDetails) => {
  const message = `Dear ${userName},\n\nPayment Successful!\n\nPayment Details:\nBook: ${bookDetails.title}\nAmount Paid: ₹${paymentDetails.amount}\nPayment ID: ${paymentDetails.paymentId}\nDate: ${new Date().toLocaleDateString()}\n\nYour book has been successfully returned.\nThank you for clearing the fine.\n\nBest regards,\nLibrary Management System`;
  return sendWhatsAppMessage(phoneNumber, message);
};

module.exports = {
  sendBookIssuedWhatsApp,
  sendBookReturnedWhatsApp,
  sendDueDateReminderWhatsApp,
  sendPaymentConfirmationWhatsApp
}; 