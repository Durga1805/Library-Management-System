const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index'); // Import the routes

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes); // Use the routes defined in index.js

// MongoDB connection and other setup code here...

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Mongodb connected');
});
