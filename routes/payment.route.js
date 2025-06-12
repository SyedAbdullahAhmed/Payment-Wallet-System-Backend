const express = require('express');
const router = express.Router();
const { sendPayment, sendMails } = require('../controllers/payment.controller');
const { verifyJWT } = require('../middlewares/auth');


router.post('/send-payment',verifyJWT, sendPayment);
router.post('/send-mails',verifyJWT, sendMails);



// Export the router
module.exports = router;
