// backend/models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  whatsappNumber: { type: String, required: true }
});

module.exports = mongoose.model('Contact', ContactSchema);
