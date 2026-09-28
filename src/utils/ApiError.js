/** An error with an HTTP status code, rendered by the error middleware as { success: false, message }. */
export default class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
