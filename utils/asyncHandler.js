// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }
const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        console.error("Async Handler Error:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = asyncHandler