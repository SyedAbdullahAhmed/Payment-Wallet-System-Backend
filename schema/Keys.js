// models/Keys.js
const mongoose = require('mongoose');

const keysSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: [true, 'Public key is required.']
  },

  privateKey: {
    type: String,
    required: [true, 'Private key is required.']
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required.']
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Keys', keysSchema);
