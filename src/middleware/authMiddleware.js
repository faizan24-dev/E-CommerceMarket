import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/** Requires a valid `Authorization: Bearer <token>` header and attaches the user to req.user. */
export async function protect(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Not authorized. Please log in.");
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

  req.user = user;
  next();
}

/** Restricts a route to the given roles. Use after `protect`. */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(403, "You do not have permission to perform this action.");
    }
    next();
  };
}
