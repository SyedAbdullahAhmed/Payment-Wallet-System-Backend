
const Card = require('../schema/CardInfo');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const addCardDetails = asyncHandler(async (req, res) => {

  const { cardholderName, cardNumber, expiryDate, cvc } = req.body;
  const user = req.user; // from auth middleware (req.user = decoded JWT)

  // Basic validation
  if (!cardholderName || !cardNumber || !expiryDate || !cvc) {
    throw new ApiError(400, 'All fields are required');
  }

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    throw new ApiError(400, 'Card number must be between 13 and 19 digits');
  }

  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
    throw new ApiError(400, 'Expiry date must be in MM/YY format');
  }

  if (cvc.length < 3 || cvc.length > 4) {
    throw new ApiError(400, 'CVC must be 3 or 4 digits');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedCardHolderName = await bcrypt.hash(cardholderName, salt);
  const hashedCardNumber = await bcrypt.hash(cardNumber, salt);
  const hashedExpiryDate = await bcrypt.hash(expiryDate, salt);
  const hashedCVC = await bcrypt.hash(cvc, salt);

  // Save card info
  const newCard = await Card.create({
    cardholderName: hashedCardHolderName,
    cardNumber: hashedCardNumber,
    expiryDate: hashedExpiryDate,
    cvc: hashedCVC,
    userId: user._id,
  });

  // Reset token with payment: true
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      payment: true
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );



  return res
    .status(200)
    .json(new ApiResponse(200, { card: newCard, token }, 'Card information saved and payment verified.'));
});


const getCardDetails = asyncHandler(async (req, res) => {

  // const user = req.user;

  // Save card info
  // const { cardholderName, cardNumber, expiryDate, cvc, userId } = await Card.findOne({ userId: user._id });

  // const isPasswordCorrect = await bcrypt.compare(password, user.password);
// const randomString = Math.random().toString(36).substring(2, 15);
// console.log(randomString)
// const crypto = require('crypto');
// const fs = require('fs');

// // === Step 1: Generate RSA Key Pair ===
// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: 'pkcs1',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs1',
//     format: 'pem'
//   }
// });

// console.log(publicKey)
// console.log(privateKey)

// console.log('✅ Public and Private Keys generated and saved.');


// // === Step 2: Encrypt and Decrypt a Message ===

// // Read keys from files
// const pubKey = publicKey
// const privKey = privateKey

// // Message to encrypt
// const message = {
//     name: "Abdullah", age: 12
// };

// // Encrypt using public key
// const encrypted = crypto.publicEncrypt(pubKey, Buffer.from(JSON.stringify(message)));
// console.log("\n🔐 Encrypted (base64):", encrypted.toString('base64'));

// // Decrypt using private key
// const decrypted = crypto.privateDecrypt(privKey, encrypted);
// console.log("\n🔓 Decrypted:", decrypted.toString());




  



  // if (!card) {
  //   throw new ApiError(404, 'Card information not found');
  // }


  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, { card }, 'Card already exists.'));
});



module.exports = {
  addCardDetails, getCardDetails
};