const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
require('./db.js');
const {authMiddleware}=require('./jwt.js'); // Import authentication middleware
const cors = require('cors');
const path = require('path');
app.use(cors());
app.use(express.static('public'));
const port = process.env.PORT || 3000;
app.use(express.json());

const UserSchema = require('./Routes/UserSchema.js'); // Import the person router
app.use('/user', UserSchema);


const CandidateSchema = require('./Routes/CandidateScheme.js'); // Import the person router
app.use('/Candidate',CandidateSchema); 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

});