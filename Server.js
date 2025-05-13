const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./Router/EnquiryRoute');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // InterServer sets this automatically

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

// DB connection
require('./Config/db');

// Routes
app.use('/api', Routes);

// Start the server (host handled automatically)
app.listen(port, () => {
  console.log(`✅ Server running on assigned port ${port}`);
});
