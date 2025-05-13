const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./Router/EnquiryRoute');
require('dotenv').config();

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Custom CORS config
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:3000',
  'https://enquiry.universalsoftlab.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps) or known origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Initialize DB connection
require('./Config/db');  // 👈 This ensures DB connects when server starts

// Routes
app.use('/api', Routes);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
});
