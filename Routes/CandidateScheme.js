const express = require('express');
const router = express.Router();
const Candidate = require('./../Models/Candidate.js');  // Import the Person model
const { authMiddleware,generateToken}= require('./../jwt.js'); // Import authentication middleware
const User = require('./../Models/user.js');


const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user?.role === 'admin' || false;
    
  } catch (err) {
    return false;
  }
};


// POST route to add a candidate
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized: No user ID in token' });
    }

    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: 'User does not have admin role' });
    }

    const data = req.body;

    // Optionally validate data here

    const newCandidate =  new Candidate(data);
    const response = await newCandidate.save();

    console.log('data saved');
    res.status(200).json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








       router.put('/:candidateID',authMiddleware, async (req, res) => {
      try {
         const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
          return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const personId = req.params.id;
        const updatedData = req.body;
    
        // Check if the email already exists for another person
        const existingPerson = await Candidate.findOne({ email: updatedData.email, _id: { $ne: personId } });
        if (existingPerson) {
          return res.status(400).json({ message: 'Email already exists' });
        }
    
        // If no other person exists with that email, update the person
        const updatedPerson = await Candidate.findByIdAndUpdate(personId, updatedData, { new: true });
        if (!updatedPerson) {
          return res.status(404).json({ message: 'Person not found' });
        }
    
        res.status(200).json({ message: 'Person updated successfully', data: updatedPerson });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating person', error: err.message });
      }
    });

       router.delete('/:candidateID',authMiddleware, async (req, res) => {
      try {
         const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
          return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        const CandidateId = req.params.id;
      
    
        // Check if the email already exists for another person
      
    
        // If no other person exists with that email, update the person
        const DeletedPerson = await Candidate.findByIdAndUpdate(CandidateId);
        if (!DeletedPerson) {
          return res.status(404).json({ message: 'Candidate not found' });
        }
    
        res.status(200).json({ message: 'Candidate deleted successfully', data: DeletedPerson });
      } catch (err) {
        res.status(500).json({ message: 'Error Deleting Candidate', error: err.message });
      }
    });
    router.post('/vote/:candidateID', authMiddleware, async (req, res) => {
      try {
        const candidateId = req.params.candidateID;
        const userId = req.user.id;

        // Check if the user has already voted
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVoted) {
          return res.status(400).json({ message: 'User has already voted' });
        }

        // Find the candidate and increment their vote count
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
          return res.status(404).json({ message: 'Candidate not found' });
        }
        if(user.role ==='admin'){
          return res.status(403).json({ message: 'Admins cannot vote' });
        }
        candidate.votes.push({
          user: userId,
          votedAt: new Date()
        });
        candidate.voteCount += 1;
        await candidate.save();
          user.isVoted = true; // Mark user as voted
          await user.save();
        res.status(200).json({ message: 'Vote cast successfully', candidate });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error casting vote', error: err.message });
      }});
  
      router.get('/vote/count',async (req, res) => {
      try {
        const candidates = await Candidate.find().sort({voteCount:'desc'});
        const voteRecord = candidates.map(candidate => ({
          name: candidate.name,
          voteCount: candidate.voteCount    
        }));
        res.status(200).json({ message: 'Vote counts retrieved successfully', voteRecord });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving vote counts', error: err.message });
      }});
module.exports= router;