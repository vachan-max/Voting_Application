const express = require('express');
const router = express.Router();
const User = require('./../Models/user.js');  // Import the Person model
const { authMiddleware,generateToken}= require('./../jwt.js'); // Import authentication middleware
const jwt = require('jsonwebtoken');
router.get('/', async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json({ message: 'Person data fetched successfully', data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching persons', error: err.message });
    }
  });
  router.post('/signup', async (req, res) => {
      try {
        const data = req.body;
        
        // Check if the email already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        
    
        // If no person exists with that email, create the new person
        const newuser =  new User(data);
        const savedUser = await newuser.save();
  
            const payload = {
            id: savedUser.id
        }
   
        const token = generateToken(payload);


        res.status(201).json({ message: 'user created successfully', data: savedUser ,token:token});
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
      }
    });
 router.post('/login', async (req, res) => { 
  try {
    const { aadharCardNo, password } = req.body;

    // ✅ Input validation
    if (!aadharCardNo || !password) {
      return res.status(400).json({ message: "Aadhar Card Number and password are required" });
    }

    // 🔍 Find user by Aadhar
    const user = await User.findOne({ aadharCardNo });
    
    // ❌ Invalid credentials
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid Aadhar Card Number or password" });
    }
      const payload = {
            id: user.id,
        }
        const token = generateToken(payload); // Ensure generateToken is implemented

    // ✅ Success
    return res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login error", error: err.message });
  }
});


router.get('/profile',authMiddleware, async (req, res) => {
  try {
    
    const userId = req.user.id; // ✅ Extract the ID from decoded token payload
    const user = await User.findById(userId);
    res.status(200).json({ message: 'Profile fetched successfully', data: user });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile fetch error", error: err.message });
  }
});


    router.put('/profile/password', async (req, res) => {
      try {
        const userId = req.user.id;// Extract user ID from the Token
        const {currentPassword,newPassword} = req.body;


        const user = await User.findById(userId);

         // 2. If user not found or password doesn't match
    if (!(await adharCard.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    user.password = newPassword; // Update the password
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Password updated successfully' }); 
    
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating person', error: err.message });
      }
    });

module.exports= router;