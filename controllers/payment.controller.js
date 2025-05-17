const Card = require('../schema/CardInfo');
const Keys = require('../schema/Keys');
const User = require('../schema/User');
const Transaction = require('../schema/Transaction');
const crypto = require('asymmetric-crypto')
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');


const sendPayment = asyncHandler(async (req, res) => {

  let { receiverPublicKey, amount, senderPrivateKey } = req.body;
  const user = req.user;

  console.log('Initiating payment...', { receiverPublicKey, amount, senderPrivateKey });

  const senderId = await Keys.findOne({ privateKey: senderPrivateKey }).select('userId');
  const receiverId = await Keys.findOne({ publicKey: receiverPublicKey }).select('userId');

  console.log('Sender ID:', senderId.userId);
  console.log('Receiver ID:', receiverId.userId);

  if (!senderId.userId || !receiverId.userId) {
    console.error('User not found');
    throw new ApiError(404, 'User not found');
  }

  const senderName = await User.findOne({ _id: senderId.userId }).select('name');
  const receiverName = await User.findOne({ _id: receiverId.userId }).select('name');

  console.log('Sender Name:', senderName);
  console.log('Receiver Name:', receiverName);

  if (!senderName || !receiverName) {
    console.error('User name not found');
    throw new ApiError(404, 'User not found');
  }

  const senderCardDetails = await Card.findOne({ userId: senderId.userId }).select('cardholderName');
  const receiverCardDetails = await Card.findOne({ userId: receiverId.userId }).select('cardholderName');

  console.log('Sender Card Details:', senderCardDetails);
  console.log('Receiver Card Details:', receiverCardDetails);

  const dataToEncrypt = {
    senderName: senderName.name,
    receiverName: receiverName.name,
    cardNumber: senderCardDetails.cardholderName,
    amount: amount,
    receiverCardNumber: receiverCardDetails.cardholderName
  }

  console.log('Data to encrypt:', dataToEncrypt);

  const encrypted = crypto.encrypt(JSON.stringify(dataToEncrypt), receiverPublicKey,senderPrivateKey);

  console.log('Encrypted data:', encrypted);



  amount = Number(amount);

  if (isNaN(amount) || amount <= 0) {
    console.error('Invalid amount:', rawAmount);
    throw new ApiError(400, 'Invalid amount provided');
  }

  const totalAmountOfSender = await User.findOne({ _id: senderId.userId }).select('totalBalance');
  if (totalAmountOfSender?.totalBalance == null) {
    console.error('Sender totalBalance not found');
    throw new ApiError(500, 'Transaction failed');
  }

  const senderBalance = Number(totalAmountOfSender.totalBalance);
  if (isNaN(senderBalance)) {
    console.error('Invalid sender balance:', totalAmountOfSender.totalBalance);
    throw new ApiError(500, 'Invalid sender balance');
  }

  if (senderBalance < amount) {
    console.warn('Insufficient funds');
    throw new ApiError(400, 'Insufficient funds');
  }

  const newAmountSender = senderBalance - amount;
  totalAmountOfSender.totalBalance = newAmountSender;
  await totalAmountOfSender.save();

  console.log(`Sender new balance: ${newAmountSender}`);

  const totalAmountOfReceiver = await User.findOne({ _id: receiverId.userId }).select('totalBalance');
  if (totalAmountOfReceiver?.totalBalance == null) {
    console.error('Receiver totalBalance not found');
    throw new ApiError(500, 'Transaction failed');
  }

  const receiverBalance = Number(totalAmountOfReceiver.totalBalance);
  if (isNaN(receiverBalance)) {
    console.error('Invalid receiver balance:', totalAmountOfReceiver.totalBalance);
    throw new ApiError(500, 'Invalid receiver balance');
  }

  const newAmountReceiver = receiverBalance + amount;
  totalAmountOfReceiver.totalBalance = newAmountReceiver;
  await totalAmountOfReceiver.save();

  console.log(`Receiver new balance: ${newAmountReceiver}`);

  const transaction = await Transaction.create({
    senderName: senderName.name,
    receiverName: receiverName.name,
    amount: amount,
    userId: senderId,
    referenceId: receiverId.userId,
    encryptedData: encrypted,
    status: 'success'
  });

  console.log('Transaction created:', transaction);

  if (!transaction) {
    console.error('Transaction creation failed');
    throw new ApiError(500, 'Transaction failed');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { "transaction": "nj" }, 'Transaction successful.'));
});

module.exports = {
  sendPayment
};


// get senderPrivate and receivePublic and amount
// find sender and receiver in db
// now 2 users id
// find both users
// get name
// create transaction
// encrypt data using senderPrivate and receiverPublic
// save encrypt data also include sendername and payment status and amount in transaction
// add total amount to sender


// dencrypt data using receiverPrivate and senderPublic

// ZCsHwp1BrbiYa3EcswkwUjUKV+B++Yc8BVkaUQJorKLXRD+sF8qljWSsJE0huxbq06ZdgM3MhhNZmjhlW97Z3g==
