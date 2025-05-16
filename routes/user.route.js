const express = require('express');
const router = express.Router();
const { signUp , verification, signIn, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth');


// router.get('/:id',verifyJWT, getUser);
router.post('/signup', signUp);
router.post('/verification', verification);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


// Export the router
module.exports = router;
