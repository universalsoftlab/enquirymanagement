const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./Router/EnquiryRoute');
require('dotenv').config();

// Initialize app
const app = express();
const port = 3306;

// Initialize DB connection
require('./Config/db');  // 👈 This ensures DB connects when server starts

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', Routes);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://174.138.185.18:${port}`);
});
