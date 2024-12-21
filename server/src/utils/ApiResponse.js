class ApiResponse {
    constructor(
        statusCode,
        message = "Sucess",
        data
    ) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}

export default ApiResponse;