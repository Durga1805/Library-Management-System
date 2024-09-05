const express = require('express');
const authController = require('../controllers/authController'); // Ensure the path is correct

const router = express.Router();

router.post('/login', authController.login);

module.exports = router;
