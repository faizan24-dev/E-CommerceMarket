import { badRequest, payloadTooLarge } from "../errors.js";

const MAX_JSON_BYTES = 32 * 1024;

/** Reads a JSON body, rejecting bodies that are too large or malformed. */
export async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_JSON_BYTES) throw payloadTooLarge("Request body is too large.");
  if (!text) return {};
  try {
    const data = JSON.parse(text);
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("not an object");
    }
    return data;
  } catch {
    throw badRequest("Request body must be a valid JSON object.");
  }
}

/** Reads a multipart body after checking Content-Length against `maxBytes`. */
export async function readFormData(request, maxBytes) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBytes) {
    throw payloadTooLarge(`Upload is too large. The limit is ${Math.floor(maxBytes / (1024 * 1024))} MB.`);
  }
  const type = request.headers.get("content-type") ?? "";
  if (!type.startsWith("multipart/form-data")) throw badRequest("Expected a multipart/form-data upload.");
  try {
    return await request.formData();
  } catch {
    throw badRequest("The upload could not be read. Please try again.");
  }
}

/**
 * The client IP. On Vercel and most proxies the first x-forwarded-for entry is
 * the real client; without a proxy this header can be spoofed, so the value is
 * only used for rate limiting and session display, never for authorization.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return (request.headers.get("x-real-ip") ?? "unknown").slice(0, 64);
}
