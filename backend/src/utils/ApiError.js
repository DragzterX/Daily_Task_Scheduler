class ApiError extends Error {
  constructor(statusCode = 500, message = 'Error', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = ApiError;
