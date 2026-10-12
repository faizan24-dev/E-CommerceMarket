import "server-only";
import { getCurrentUser } from "../auth/session.js";
import { canSell, isAdmin } from "../auth/policies.js";
import { connectDB } from "../db.js";
import { forbidden, unauthorized } from "../errors.js";
import { assertSameOrigin } from "../security/origin.js";
import { consumeRateLimit } from "../security/rateLimit.js";
import { getClientIp } from "./request.js";
import { errorResponse } from "./response.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Wraps a Route Handler with the cross-cutting concerns every endpoint needs.
 *
 *   export const POST = apiRoute({ auth: "user", rateLimit: "checkout" }, async ({ request, user }) => {...});
 *
 * Options:
 *   auth       "user" | "seller" | "admin" (required) or "optional"; omit for public endpoints
 *   rateLimit  a name from RATE_LIMITS, applied per client IP. State-changing requests
 *              fall back to the general "write" limit.
 *
 * Order of checks: same-origin (CSRF) -> database -> rate limit -> authentication.
 * The handler receives `{ request, params, user, ip }` and returns a Response.
 * Anything it throws becomes a consistent JSON error.
 */
export function apiRoute(options, handler) {
  if (typeof options === "function") [options, handler] = [{}, options];
  const { auth, rateLimit } = options;

  return async function routeHandler(request, context) {
    try {
      const isSafe = SAFE_METHODS.has(request.method);
      if (!isSafe) assertSameOrigin(request);

      await connectDB();

      const ip = getClientIp(request);
      const limitName = rateLimit ?? (isSafe ? null : "write");
      if (limitName) await consumeRateLimit(limitName, ip);

      let user = null;
      if (auth) {
        user = await getCurrentUser();
        if (!user && auth !== "optional") throw unauthorized();
        if (auth === "admin" && !isAdmin(user)) throw forbidden();
        if (auth === "seller" && !canSell(user)) throw forbidden("Open your seller shop first.");
      }

      const params = (await context?.params) ?? {};
      return await handler({ request, params, user, ip });
    } catch (error) {
      return errorResponse(error);
    }
  };
}
