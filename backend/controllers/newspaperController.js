const Newspaper = require('../models/Newspaper');
const path = require('path');
const fs = require('fs').promises;

exports.uploadNewspaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, date, language } = req.body;

    // Create new newspaper document
    const newspaper = new Newspaper({
      title,
      date,
      language,
      filePath: req.file.path,
      uploadedBy: req.user._id // From auth middleware
    });

    await newspaper.save();

    res.status(201).json({
      message: 'Newspaper uploaded successfully',
      newspaper
    });
  } catch (error) {
    console.error('Error uploading newspaper:', error);
    res.status(500).json({
      message: 'Error uploading newspaper',
      error: error.message
    });
  }
};

exports.getAllNewspapers = async (req, res) => {
  try {
    const newspapers = await Newspaper.find()
      .sort({ date: -1 })
      .select('title date language _id');

    res.json(newspapers);
  } catch (error) {
    console.error('Error fetching newspapers:', error);
    res.status(500).json({
      message: 'Error fetching newspapers',
      error: error.message
    });
  }
};

exports.getNewspaperById = async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper not found' });
    }

    // Set proper headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${newspaper.title}.pdf"`);

    // Send the file
    res.sendFile(path.resolve(newspaper.filePath), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      }
    });
  } catch (error) {
    console.error('Error fetching newspaper:', error);
    res.status(500).json({
      message: 'Error fetching newspaper',
      error: error.message
    });
  }
};

// // Add guest access methods
// exports.getGuestNewspapers = async (req, res) => {
//   try {
//     const newspapers = await Newspaper.find()
//       .sort({ date: -1 })
//       .select('title date language');

//     res.json(newspapers);
//   } catch (error) {
//     console.error('Error fetching newspapers:', error);
//     res.status(500).json({
//       message: 'Error fetching newspapers',
//       error: error.message
//     });
//   }
// };

// exports.getGuestNewspaperById = async (req, res) => {
//   try {
//     const newspaper = await Newspaper.findById(req.params.id);
//     if (!newspaper) {
//       return res.status(404).json({ message: 'Newspaper not found' });
//     }

//     // Set proper headers for PDF
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="${newspaper.title}.pdf"`);

//     // Send the file
//     res.sendFile(path.resolve(newspaper.filePath), (err) => {
//       if (err) {
//         console.error('Error sending file:', err);
//         res.status(500).json({ message: 'Error sending file' });
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching newspaper:', error);
//     res.status(500).json({
//       message: 'Error fetching newspaper',
//       error: error.message
//     });
//   }
// };