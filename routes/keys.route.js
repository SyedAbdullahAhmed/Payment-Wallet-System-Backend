const express = require('express');
const router = express.Router();
const { generateKeys,getKeys, getPublicKeys } = require('../controllers/keys.controller');
const { verifyJWT } = require('../middlewares/auth');


router.get('/get-keys',verifyJWT, getKeys);
router.post('/generate-keys',verifyJWT, generateKeys);
router.get('/get-public-keys', getPublicKeys);




// Export the router
module.exports = router;
