const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to generate token');
  }
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, branch, year, contactNumber } = req.body;
    console.log('Registration request received:', { name, email, branch, year, contactNumber });

    if (!name || !email || !password || !branch || !year) {
      console.log('Missing fields:', { name: !!name, email: !!email, password: !!password, branch: !!branch, year: !!year });
      return res.status(400).json({ message: 'All required fields are missing' });
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user...');
    const user = new User({
      name,
      email,
      password,
      branch,
      year,
      contactNumber: contactNumber || ''
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully:', user.email);
    console.log('User ID:', user._id);

    if (!user._id) {
      throw new Error('Failed to create user - no ID generated');
    }

    const token = generateToken(user._id.toString());
    console.log('Token generated successfully');

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
      contactNumber: user.contactNumber
    };

    console.log('Sending response:', { token: '***', user: userResponse });

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    console.error('========================');
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        contactNumber: user.contactNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: error.message 
    });
  }
};

module.exports = { register, login };
