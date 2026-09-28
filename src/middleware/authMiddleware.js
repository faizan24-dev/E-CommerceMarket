import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/**
 * Requires a valid `Authorization: Bearer <token>` header.
 * Returns the logged-in user, or throws a 401 ApiError.
 */
export async function protect(request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Not authorized. Please log in.");
  }
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "Server is not configured: JWT_SECRET environment variable is missing.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Not authorized. Invalid token.";
    throw new ApiError(401, message);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "The account for this session no longer exists.");
  }
  return user;
}

/** Throws 403 unless the user has one of the given roles. Use after `protect`. */
export function authorize(user, ...roles) {
  if (!roles.includes(user?.role)) {
    throw new ApiError(403, "You do not have permission to perform this action.");
  }
}
