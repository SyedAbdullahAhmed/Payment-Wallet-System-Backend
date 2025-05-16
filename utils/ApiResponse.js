class ApiResponse {
    constructor(statusCode, data, message = "Success", customProps = {}) {
        this.statusCode = statusCode
        this.success = statusCode < 400
        this.message = message
        this.data = data
        Object.assign(this, customProps)
    }
}

module.exports = ApiResponse 