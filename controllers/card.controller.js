
const Card = require('../schema/CardInfo');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');


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

  // Save card info
  const newCard = await Card.create({
    cardholderName,
    cardNumber,
    expiryDate,
    cvc,
    userId: user._id
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

  // res.cookie('token', token, {
  //   httpOnly: false,
  //   secure: false,
  //   sameSite: 'strict',
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  //   path: '/',
  //   overwrite: true
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, { card: newCard, token }, 'Card information saved and payment verified.'));
});


const getCardDetails = asyncHandler(async (req, res) => {

  const user = req.user; 

  // Save card info
  const card = await Card.findOne({ userId: user._id });

  if (!card) {
    throw new ApiError(404, 'Card information not found');
  }


  return res
    .status(200)
    .json(new ApiResponse(200, { card }, 'Card already exists.'));
});



module.exports = {
  addCardDetails,getCardDetails
};