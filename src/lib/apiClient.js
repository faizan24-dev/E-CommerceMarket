/** Error thrown for any failed API call. `status` is 0 when the server could not be reached. */
export class ApiRequestError extends Error {
  constructor(message, { status, fieldErrors, details } = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
    this.details = details ?? {};
  }
}

/**
 * Calls the app's own API (same origin, session cookie included) and returns the JSON body.
 * `body` may be a plain object (sent as JSON) or FormData (sent as multipart, e.g. uploads).
 * Throws ApiRequestError carrying the server's message and per-field errors.
 */
export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      credentials: "same-origin",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiRequestError("We couldn't reach the server. Please check your connection and try again.", {
      status: 0,
    });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new ApiRequestError(data.message || `Request failed with status ${response.status}.`, {
      status: response.status,
      fieldErrors: data.fieldErrors,
      details: data.details,
    });
  }
  return data;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};
