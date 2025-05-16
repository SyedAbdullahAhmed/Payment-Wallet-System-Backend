const express = require('express');
const router = express.Router();
// const { signUp , verification, signIn, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth');


router.get('/card-details',verifyJWT, getCardDetails);
router.post('/card-details', addCardDetails);




// Export the router
module.exports = router;
