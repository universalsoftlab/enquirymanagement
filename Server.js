const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./Router/EnquiryRoute');
require('dotenv').config();

const app = express();
const port = process.env.PORT; // ✅ Plesk dynamically injects this

// CORS config
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:3000',
  'https://enquiry.universalsoftlab.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS check for origin:', origin);
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

// Temporary health check route for testing
app.get('/health', (req, res) => {
  res.json({ status: 'OK', port });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on assigned port ${port}`);
});
