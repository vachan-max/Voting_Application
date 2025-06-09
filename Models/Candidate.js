const mongoose = require('mongoose');


const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  voteCount: {
    type: Number,
    default: 0
  }
}, 

);


const Candidate = mongoose.model('Candidate', CandidateSchema);
module.exports = Candidate;
// This code defines a Mongoose schema for a User model in a Node.js application.