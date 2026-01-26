require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Check MongoDB connection before processing requests
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB not connected. State:', mongoose.connection.readyState);
    return res.status(503).json({ message: 'Database not connected. Please try again later.' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'College Connect API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
