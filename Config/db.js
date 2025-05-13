require('dotenv').config();  // Load environment variables from .env
const mysql = require('mysql2');

// Debug output for verification
console.log('🧪 DB Connection Configuration:');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'Not Set');
console.log('  DB_NAME:', process.env.DB_NAME);

// Create connection
const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME 
});

// Attempt connection
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = db;
