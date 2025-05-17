const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  referenceId: {
    type: String,
    required: [true, 'Reference ID is required'],
  },
  encryptedData: {
    data: {
      type: String,
      required: [true, 'Encrypted data is required'],
    },
    nonce: {
      type: String,
      required: [true, 'Nonce is required'],
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
