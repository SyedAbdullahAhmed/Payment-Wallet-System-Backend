// models/CardInfo.js
const mongoose = require('mongoose');

const cardInfoSchema = new mongoose.Schema({
  cardholderName: {
    type: String,
    required: [true, 'Cardholder name is required.']
  },

  cardNumber: {
    type: String,
    required: [true, 'Card number is required.'],
    minlength: [13, 'Card number must be at least 13 digits.'],
    maxlength: [19, 'Card number must be at most 19 digits.']
  },

  expiryDate: {
    type: String,
    required: [true, 'Expiry date is required.'],
    validate: {
      validator: (v) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(v),
      message: 'Expiry date must be in MM/YY format.'
    }
  },

  cvc: {
    type: String,
    required: [true, 'CVC is required.'],
    minlength: [3, 'CVC must be 3 or 4 digits.'],
    maxlength: [4, 'CVC must be 3 or 4 digits.']
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
