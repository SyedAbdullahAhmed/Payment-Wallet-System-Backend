const express = require('express');
const router = express.Router();
const { generateKeys,getKeys } = require('../controllers/keys.controller');
const { verifyJWT } = require('../middlewares/auth');


router.get('/get-keys',verifyJWT, getKeys);
router.post('/generate-keys',verifyJWT, generateKeys);




// Export the router
module.exports = router;
