const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./Router/EnquiryRoute');
require('dotenv').config();

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// CORS config
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:3000',
  'https://enquiry.universalsoftlab.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed from this origin: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Initialize DB connection
require('./Config/db');

// Routes
app.use('/api', Routes);

// Start server with error handler
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Try a different one in your .env file.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});
