/** Converts any thrown error into a consistent `{ success: false, message }` JSON response. */
export function errorHandler(err) {
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
  }

  if (statusCode >= 500) {
    console.error("[api] error:", err);
    // Configuration errors (ApiError) carry a safe, useful message; hide anything unexpected.
    if (!err.statusCode && process.env.NODE_ENV === "production") message = "Internal server error.";
  }

  return Response.json({ success: false, message }, { status: statusCode });
}
