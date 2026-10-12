/**
 * An expected failure with an HTTP status code. Services throw these; the API
 * layer turns them into `{ success: false, message, fieldErrors?, details? }` responses.
 */
export class AppError extends Error {
  constructor(statusCode, message, { fieldErrors, details } = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    if (fieldErrors) this.fieldErrors = fieldErrors;
    if (details) this.details = details;
  }
}

export const badRequest = (message, options) => new AppError(400, message, options);
export const unauthorized = (message = "Please log in to continue.") => new AppError(401, message);
export const forbidden = (message = "You do not have permission to do that.") => new AppError(403, message);
export const notFound = (message = "Not found.") => new AppError(404, message);
export const conflict = (message, options) => new AppError(409, message, options);
export const payloadTooLarge = (message) => new AppError(413, message);
export const tooManyRequests = (message = "Too many attempts. Please wait a few minutes and try again.") =>
  new AppError(429, message);
