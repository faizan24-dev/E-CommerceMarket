import connectDB from "../config/db.js";
import { errorHandler } from "../middleware/errorMiddleware.js";
import ApiError from "./ApiError.js";

const MAX_BODY_BYTES = 10 * 1024;

/**
 * Wraps a route handler: connects to MongoDB first, then turns any thrown error
 * into a `{ success: false, message }` JSON response with the right status code.
 */
export function apiHandler(handler, { database = true } = {}) {
  return async (request, context) => {
    try {
      if (database) await connectDB();
      return await handler(request, context);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

/** Reads a JSON request body, rejecting bodies that are too large or not valid JSON. */
export async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new ApiError(413, "Request body is too large.");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }
}

export function json(data, status = 200) {
  return Response.json(data, { status });
}
