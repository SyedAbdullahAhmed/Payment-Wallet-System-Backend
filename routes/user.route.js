const express = require('express');
const router = express.Router();
const { signUp , verification, signIn, forgotPassword, resetPassword, checkPassword, totalBalance } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth');


// router.get('/:id',verifyJWT, getUser);
router.post('/signup', signUp);
router.post('/verification', verification);
router.post('/signin', signIn);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/reset-password', resetPassword);
router.post('/check-password', verifyJWT, checkPassword);
router.get('/total-balance', verifyJWT, totalBalance);


// Export the router
module.exports = router;
