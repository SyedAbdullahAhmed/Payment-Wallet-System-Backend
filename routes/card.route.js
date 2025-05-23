const express = require('express');
const router = express.Router();
const { addCardDetails, getCardDetails } = require('../controllers/card.controller');
const { verifyJWT } = require('../middlewares/auth');


// router.get('/card-details',verifyJWT, getCardDetails);
router.post('/card-details',verifyJWT, addCardDetails);


// Export the router
module.exports = router;
