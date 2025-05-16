const express = require('express');
const router = express.Router();
// const { signUp , verification, signIn, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth');


router.post('/send-payment', sendPayment);



// Export the router
module.exports = router;
