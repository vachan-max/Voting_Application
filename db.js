const mongoose = require('mongoose');
require('dotenv').config();

const mongooseurl = process.env.DB_URL;

if (!mongooseurl) {
  console.error('❌ DB_URL not found in .env1');
  process.exit(1);
}

mongoose.connect(process.env.DB_URL); // ✅ Clean, modern way


const db = mongoose.connection;

db.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});
db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('⚠️ MongoDB has been disconnected');
});

module.exports = db;
