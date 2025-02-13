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

// Export Functions
module.exports = {
    verifyConnection,
    sendEmail,
    sendCredentialEmail,
    sendBookIssuedEmail,
    sendBookReturnedEmail
};

