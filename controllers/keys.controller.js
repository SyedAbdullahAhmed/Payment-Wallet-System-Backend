
const Keys = require('../schema/Keys');
// const User = require('../schema/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
// const crypto = require('asymmetric-crypto')
// const bcrypt = require('bcryptjs');
const generatePublicPrivateKeys = require('../utils/generateKeys');



const generateKeys = asyncHandler(async (req, res) => {
  console.log('🔐 Starting key generation process');

  const user = req.user;
  const password = req.body.password;

  console.log('🧾 User Info:', user);
  console.log('🔑 Provided password:', password);

  // Simulated key generation — ensure you have a valid crypto key pair generator
  const keyPair = generatePublicPrivateKeys();
  console.log('✅ Key pair generated');

  let publicKey = keyPair.publicKey;
  let privateKey = keyPair.privateKey;


  console.log('🗝️ Public Key:', publicKey);
  console.log('🔒 Private Key:', privateKey);

  const getKeys = await Keys.findOne({ userId: user._id });
  if (getKeys) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { publicKey, privateKey: privateKey },
        'Keys are already present.'
      )
    );
  }

  const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
  const privateKeyBase64 = Buffer.from(privateKey).toString('base64');


  const keys = await Keys.create({
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64,
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
      { publicKey: publicKeyBase64, privateKey: privateKeyBase64 },
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
      {
        publicKey: Buffer.from(getKeys.publicKey).toString('base64'),
        privateKey: Buffer.from(getKeys.privateKey).toString('base64')
      },
      'Keys generated successfully.'
    )
  );
});


const getPublicKeys = asyncHandler(async (req, res) => {



  const publicKeys = await Keys.aggregate([
    {
      $lookup: {
        from: 'users',                 // collection to join
        localField: 'userId',         // field from Keys
        foreignField: '_id',          // field from Users
        as: 'userInfo'                // output array field
      }
    },
    {
      $unwind: '$userInfo'            // flatten the userInfo array
    },
    {
      $project: {
        _id: 1,
        publicKey: 1,
        name: '$userInfo.name'    // select username from joined user
      }
    }
  ]);

  console.log('Public Keys:', publicKeys);

  // publicKeys.forEach(keys => {
  //   keys.publicKey = Buffer.from(keys.publicKey, 'base64').toString('utf-8');
  // });
  // console.log('Public Keys:', publicKeys);


  return res.status(200).json(
    new ApiResponse(
      200,
      publicKeys,
      'Keys generated successfully.'
    )
  );
});



``

module.exports = {
  generateKeys, getKeys, getPublicKeys
};

