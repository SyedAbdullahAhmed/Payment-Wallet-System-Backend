const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const User = require('../schema/User');

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // get token from header or cookies
        // cookie is not present in mobile use header instead
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Token:", token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // verify token => find user => attach user to request object
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("Auth Error Details:", error);
        if (error.cause) {
            console.error("Error Cause:", error.cause);
        }
        // Then throw your ApiError
        throw new ApiError(401, "Authentication failed", error.cause);
        // throw new ApiError(401, error?.message || "Invalid access token")
    }

})

module.exports = { verifyJWT }