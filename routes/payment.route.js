const express = require('express');
const router = express.Router();
const { sendPayment } = require('../controllers/payment.controller');
const { verifyJWT } = require('../middlewares/auth');


router.post('/send-payment',verifyJWT, sendPayment);



// Export the router
module.exports = router;
