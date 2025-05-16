const User = require('../schema/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcryptjs');
const { generateFourDigitCode } = require('../utils/codeGenerator');
const validateUserEmailUsingArcjet = require('../utils/validateEmailUsingArcjet')
const generateTokenAndSetCookie = require('../utils/generateToken');



const signUp = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, 'All fields are required');

  const isValidEmail = await validateUserEmailUsingArcjet(req, email);
  if (!isValidEmail) {
    throw new ApiError(400, 'Email is disposable or invalid');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ApiError(400, 'Email already registered');

  const isNotUniqueUser = await User.findOne({ name });
  if (isNotUniqueUser)
    throw new ApiError(400, 'Name already registered');


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationCode = generateFourDigitCode();
  const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const user = new User({
    name,
    email,
    password: hashedPassword,
    verificationCode,
    codeExpiry,
  });

  await user.save();

  const mailOptions = {
    to: email,
    subject: 'Verify your email',
    html: `<p>Hi ${name},</p> Your verification code is <b>${verificationCode}</b></p>`,
  }
  const isEmailSent = await sendMail(mailOptions);

  if (!isEmailSent) {
    throw new ApiError(500, 'Failed to send verification email');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered. Verification email sent.'));
});


const verification = asyncHandler(async (req, res) => {

  const { code } = req.body;

  if (!code) throw new ApiError(400, 'Email and code are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  if (
    user.verificationCode !== code ||
    !user.codeExpiry ||
    user.codeExpiry < new Date()
  ) {
    throw new ApiError(400, 'Invalid or expired verification code');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.codeExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Email successfully verified!'));
});


const signIn = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    throw new ApiError(401, 'Invalid email or password');

  if (!user.isVerified)
    throw new ApiError(403, 'Please verify your email before logging in');

  const token = generateTokenAndSetCookie(user, res);

  return res
    .status(200)
    .json(new ApiResponse(200, { token, user }, 'Login successful'));
});


const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  const verificationCode = generateFourDigitCode();
  const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.verificationCode = verificationCode;
  user.codeExpiry = codeExpiry;

  await user.save();

  const mailOptions = {
    to: email,
    subject: 'Reset your password',
    html: `<p>Hi ${user.name},</p><p>Your password reset code is <b>${verificationCode}</b>.</p><p>This code will expire in 15 minutes.</p>`,
  };

  const isEmailSent = await sendMail(mailOptions);
  if (!isEmailSent) {
    throw new ApiError(500, 'Failed to send reset code');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Reset code sent to email'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  if (!email || !verificationCode || !newPassword) {
    throw new ApiError(400, 'All fields are required: email, code, and new password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (
    !user.verificationCode ||
    user.verificationCode !== verificationCode ||
    !user.codeExpiry ||
    user.codeExpiry < new Date()
  ) {
    throw new ApiError(400, 'Invalid or expired verification code');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.verificationCode = undefined;
  user.codeExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password reset successfully'));
});


module.exports = {
  signUp, verification, signIn, forgotPassword, resetPassword
};

