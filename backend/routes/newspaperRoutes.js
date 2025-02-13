const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const newspaperController = require('../controllers/newspaperController');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/newspapers/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'newspaper-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
router.post('/upload', auth, upload.single('file'), newspaperController.uploadNewspaper);
router.get('/', newspaperController.getAllNewspapers);
router.get('/:id', newspaperController.getNewspaperById);
// router.get('/guest', newspaperController.getGuestNewspapers);
// router.get('/guest/:id', newspaperController.getGuestNewspaperById);

module.exports = router; 