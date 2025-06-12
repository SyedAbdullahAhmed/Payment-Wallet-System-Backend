// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v),
      message: 'Invalid email format.'
    }
  },

  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.']
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String,
    default: null,
  },

  tokenExpiry: {
    type: Date,
    default: null,
  },

  verificationCode: {
    type: String,
    default: null,
  },

  codeExpiry: {
    type: Date,
    default: null,
  },

  totalBalance: {
    type: Number,
    default: 1000,
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
