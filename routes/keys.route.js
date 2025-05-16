const express = require('express');
const router = express.Router();
// const { createUser, getUser, getUsers, updateUser, deleteUser, verifyUser, loginUser, forgotPassword, logoutUser, newRefreshToken } = require('../controllers/user.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');


// router.get('/:id',verifyJWT, getUser);
router.get('/',verifyJWT, getUsers);


// Export the router
module.exports = router;
