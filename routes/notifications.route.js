const express = require('express');
const router = express.Router();
const {  getNotifications } = require('../controllers/notifications.controller');
const { verifyJWT } = require('../middlewares/auth');


router.get('/my-notifications',verifyJWT, getNotifications);

// Export the router
module.exports = router;
