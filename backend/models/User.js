const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    default: ''
  },
  collegeName: {
    type: String,
    default: 'Your College Name'
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EE', 'Civil'],
    required: true
  },
  year: {
    type: String,
    enum: ['First', 'Second', 'Third', 'Fourth'],
    required: true
  },
  rollNo: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  currentLearning: [{
    type: String
  }],
  hackathonParticipation: {
    type: String,
    default: ''
  },
  codingContestRanks: {
    type: String,
    default: ''
  },
  internship: {
    type: String,
    default: ''
  },
  collegeClubs: {
    type: String,
    default: ''
  },
  profileLinks: {
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    },
    resume: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
