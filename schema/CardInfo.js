// models/CardInfo.js
const mongoose = require('mongoose');

const cardInfoSchema = new mongoose.Schema({
  cardholderName: {
    type: String,
    required: [true, 'Cardholder name is required.']
  },

  cardNumber: {
    type: String,
    required: [true, 'Card number is required.']
  },

  expiryDate: {
    type: String,
    required: [true, 'Expiry date is required.'],
  },

  cvc: {
    type: String,
    required: [true, 'CVC is required.']
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required.']
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('CardInfo', cardInfoSchema);
