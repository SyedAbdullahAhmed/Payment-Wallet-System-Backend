class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Calls the parent class constructor with the message

        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // Log information about the error instance being created
        console.log('Creating ApiError instance:');
        console.log(`StatusCode: ${statusCode}, Message: ${message}`);
        if (errors.length > 0) {
            console.log('Errors:', errors);
        }

        // Log the stack trace if it's available
        if (stack) {
            console.log('Stack:', stack);
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
            console.log('Stack captured:', this.stack); // Log captured stack trace
        }
    }
}

module.exports = ApiError;