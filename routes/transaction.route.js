const express = require('express');
const router = express.Router();
// const { signUp , verification, signIn, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth');


router.get('/transaction/:id',verifyJWT, getTransactionById);
router.get('/transaction', getAllTransactions);
router.post('/transaction', addTransaction);
router.delete('/transaction/:id', deleteTransactionById);


// add transaction
// delete transaction
// get transactions
// get transactions by id



// Export the router
module.exports = router;
