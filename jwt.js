const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ This should contain { id: ..., ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};



const generateToken = (savedUser) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(savedUser, process.env.JWT_SECRET, { expiresIn: '1h' });
};


module.exports = {authMiddleware, generateToken };
