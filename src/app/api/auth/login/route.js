import { createSession } from "@/server/auth/session";
import { toUserDTO } from "@/server/dto";
import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { consumeRateLimit } from "@/server/security/rateLimit";
import { authenticate } from "@/server/services/authService";

/**
 * POST /api/auth/login  { email, password } -> { user } plus an httpOnly session cookie.
 * Limited per IP and per target email, which slows password guessing spread across many IPs.
 */
export const POST = apiRoute({ rateLimit: "login" }, async ({ request, ip }) => {
  const body = await readJson(request);
  if (typeof body.email === "string") {
    await consumeRateLimit("loginEmail", body.email.trim().toLowerCase().slice(0, 254));
  }

  const user = await authenticate(body);
  await createSession(user._id, { userAgent: request.headers.get("user-agent") ?? "", ip });
  return ok({ user: toUserDTO(user) });
});
