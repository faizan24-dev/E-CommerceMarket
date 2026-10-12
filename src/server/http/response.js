import { ZodError } from "zod";
import { AppError } from "../errors.js";

/** JSON response. API responses carry user-specific data, so they are never cached. */
export function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function ok(data = {}, status = 200) {
  return json({ success: true, ...data }, status);
}

/** Converts any thrown error into `{ success: false, message, fieldErrors? }` with the right status. */
export function errorResponse(error) {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) console.error("[api]", error.message);
    return json(
      { success: false, message: error.message, fieldErrors: error.fieldErrors, details: error.details },
      error.statusCode,
    );
  }
  if (error instanceof ZodError) {
    return json({ success: false, message: error.issues[0]?.message ?? "Invalid input." }, 400);
  }
  if (error?.name === "ValidationError") {
    const message = Object.values(error.errors).map((e) => e.message).join(". ");
    return json({ success: false, message }, 400);
  }
  if (error?.name === "CastError") {
    return json({ success: false, message: `Invalid value for ${error.path}.` }, 400);
  }
  if (error?.code === 11000) {
    return json({ success: false, message: "That record already exists." }, 409);
  }

  // Unexpected: log the details, but never send internals to the client.
  console.error("[api] unexpected error:", error);
  return json({ success: false, message: "Something went wrong on our side. Please try again." }, 500);
}
