import ApiError from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Converts any thrown error into a consistent `{ success: false, message }` JSON response.
 * Express identifies error handlers by their 4 arguments, so `_next` must stay.
 */
export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode ?? 500;
  let message = err.message || "Something went wrong.";

  if (err.name === "ValidationError") {
    // Mongoose schema validation failed
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  } else if (err.code === 11000) {
    // Unique index violation (e.g. two signups racing with the same email)
    statusCode = 400;
    message = "An account with this email already exists. Try logging in instead.";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}.`;
  } else if (err.type === "entity.parse.failed") {
    // Malformed JSON body
    statusCode = 400;
    message = "Request body must be valid JSON.";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body is too large.";
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
    // Don't leak internals to clients in production.
    if (process.env.NODE_ENV === "production") message = "Internal server error.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
