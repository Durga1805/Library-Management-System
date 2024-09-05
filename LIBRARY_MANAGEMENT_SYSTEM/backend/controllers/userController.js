const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const User = require('../models/User'); 
exports.uploadCsv = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = path.resolve(__dirname, '..', 'uploads', file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error reading file.' });
    }

    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          console.log('Parsed CSV Data:', results.data);

          const users = results.data;

          for (const userData of users) {
            // Validate userData if needed
            console.log('Saving user data to MongoDB...');
            const newUser = new User(userData);
            await newUser.save();
            console.log('User successfully added:', newUser);
          }

          res.status(200).json({ message: 'Users successfully added!' });
        } catch (error) {
          console.error('Error saving users:', error);
          res.status(500).json({ message: 'Error adding users.', error: error.message });
        } finally {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
          });
        }
      },
      error: (parseError) => {
        console.error('Error parsing CSV file:', parseError);
        res.status(500).json({ message: 'Error parsing CSV file.', error: parseError.message });
      },
    });
  });
};
