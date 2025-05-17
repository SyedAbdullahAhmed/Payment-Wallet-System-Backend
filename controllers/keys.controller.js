
const Keys = require('../schema/Keys');
const User = require('../schema/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('asymmetric-crypto')
const bcrypt = require('bcryptjs');

const generateKeys = asyncHandler(async (req, res) => {
  console.log('🔐 Starting key generation process');

  const user = req.user;
  const password = req.body.password;

  console.log('🧾 User Info:', user);
  console.log('🔑 Provided password:', password);

  // Simulated key generation — ensure you have a valid crypto key pair generator
  const keyPair = crypto.keyPair();
  console.log('✅ Key pair generated');

  const publicKey = keyPair.publicKey;
  const secretKey = keyPair.secretKey;

  console.log('🗝️ Public Key:', publicKey);
  console.log('🔒 Private Key:', secretKey);

  const getKeys = await Keys.findOne({ userId: user._id });
  if (getKeys) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { publicKey, privateKey: secretKey },
        'Keys are already present.'
      )
    );
  }

  const keys = await Keys.create({
    publicKey,
    privateKey: secretKey,
    userId: user._id
  });

  if (!keys) {
    console.error('❌ Failed to generate keys in DB');
    throw new ApiError(404, 'Keys not generated');
  }

  console.log('✅ Keys saved to DB:', keys);


  return res.status(200).json(
    new ApiResponse(
      200,
      { publicKey, privateKey: secretKey },
      'Keys generated successfully.'
    )
  );
});


const getKeys = asyncHandler(async (req, res) => {
  console.log('🔐 Starting key generation process');

  const user = req.user;
  

  const getKeys = await Keys.findOne({ userId: user._id });

  if (!getKeys) {
    console.error('❌ Keys not found in DB');
    throw new ApiError(404, 'Keys not found');
  }




  return res.status(200).json(
    new ApiResponse(
      200,
      { publicKey: getKeys.publicKey , privateKey: getKeys.privateKey },
      'Keys generated successfully.'
    )
  );
});





module.exports = {
  generateKeys, getKeys
};