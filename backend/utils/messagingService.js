const emailService = require('./emailService');
const whatsappService = require('./whatsappService');

// Unified messaging for book issuance
const sendBookIssuedNotifications = async (userData, bookData) => {
    try {
        // Send email notification
        await emailService.sendBookIssuedEmail(
            userData.email,
            userData.name,
            bookData.title,
            bookData.dueDate
        );

        // Send WhatsApp notification if phone number exists
        if (userData.phoneNumber) {
            await whatsappService.sendBookIssuedWhatsApp(
                userData.phoneNumber,
                userData.name,
                bookData.title,
                bookData.dueDate
            );
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
};

// Unified messaging for book return
const sendBookReturnedNotifications = async (userData, bookData) => {
    try {
        // Send email notification
        await emailService.sendBookReturnedEmail(
            userData.email,
            userData.name,
            bookData.title
        );

        // Send WhatsApp notification if phone number exists
        if (userData.phoneNumber) {
            await whatsappService.sendBookReturnedWhatsApp(
                userData.phoneNumber,
                userData.name,
                bookData.title
            );
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
};

// Unified messaging for due date reminders
const sendDueDateReminderNotifications = async (userData, bookData, daysRemaining) => {
    try {
        // Send email notification
        await emailService.sendDueDateReminder(
            userData.email,
            userData.name,
            bookData,
            daysRemaining
        );

        // Send WhatsApp notification if phone number exists
        if (userData.phoneNumber) {
            await whatsappService.sendDueDateReminderWhatsApp(
                userData.phoneNumber,
                userData.name,
                bookData,
                daysRemaining
            );
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
};

// Unified messaging for payment confirmation
const sendPaymentConfirmationNotifications = async (userData, bookData, paymentDetails) => {
    try {
        // Send email notification
        await emailService.sendPaymentConfirmationEmail(
            userData.email,
            userData.name,
            bookData,
            paymentDetails
        );

        // Send WhatsApp notification if phone number exists
        if (userData.phoneNumber) {
            await whatsappService.sendPaymentConfirmationWhatsApp(
                userData.phoneNumber,
                userData.name,
                bookData,
                paymentDetails
            );
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
};

module.exports = {
    sendBookIssuedNotifications,
    sendBookReturnedNotifications,
    sendDueDateReminderNotifications,
    sendPaymentConfirmationNotifications
}; 