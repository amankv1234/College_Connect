const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_connect';
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Make sure MongoDB is running on:', process.env.MONGODB_URI || 'mongodb://localhost:27017');
    process.exit(1);
  }
};

module.exports = connectDB;
