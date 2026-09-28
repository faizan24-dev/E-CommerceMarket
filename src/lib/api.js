// The API is served by the same server as the website (see server.js), so a relative path works.
// Set NEXT_PUBLIC_API_URL only if the API is ever hosted on a different domain.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "/api").replace(/\/$/, "");

/** Error thrown for any failed API call. `status` is 0 when the server could not be reached. */
export class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

/**
 * Calls the Express API and returns the parsed JSON body.
 * Throws ApiRequestError with the server's `message` when the response is not ok.
 */
export async function apiRequest(path, { method = "GET", body, token, signal } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiRequestError(
      "We couldn't reach the server. Please check your connection and try again.",
      0,
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new ApiRequestError(data.message || `Request failed with status ${response.status}.`, response.status);
  }
  return data;
}
