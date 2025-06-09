const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
require('dotenv').config(); // Load environment variables from .env file


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  age:{
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  
  },
  email: {
    type: String,
   
  },
  address:{
    type: String,
    required: true,
  },
  addharCardNumber:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum: ['user','admin'],
    default: 'user',
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre('save', async function (next) {
  const person = this;

  // Only hash the password if it's new or modified
  if (!person.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(person.password, salt);
    person.password = hashed;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    return next(err);
  }
});

// Instance method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try{
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  }catch (err) {
    console.error("Error comparing password:", err);
    throw err; // Rethrow the error for handling in the calling function
  }
  
};
const User = mongoose.model('User', userSchema);
module.exports = User;
// This code defines a Mongoose schema for a User model in a Node.js application.