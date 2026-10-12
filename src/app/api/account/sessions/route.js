import { getCurrentSession } from "@/server/auth/session";
import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";
import { listSessions, revokeOtherSessions } from "@/server/services/sessionService";

/** GET /api/account/sessions -> { sessions } active logins on every device. */
export const GET = apiRoute({ auth: "user" }, async ({ user }) => {
  const current = await getCurrentSession();
  return ok({ sessions: await listSessions(user._id, current._id) });
});

/** DELETE /api/account/sessions -> signs out every device except this one. */
export const DELETE = apiRoute({ auth: "user" }, async ({ user }) => {
  const current = await getCurrentSession();
  const count = await revokeOtherSessions(user._id, current._id);
  return ok({ revoked: count });
});
