import { getCurrentSession } from "@/server/auth/session";
import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { changePassword } from "@/server/services/authService";

/** PUT /api/account/password  { currentPassword, newPassword }. Signs out all other sessions. */
export const PUT = apiRoute({ auth: "user", rateLimit: "password" }, async ({ request, user }) => {
  const session = await getCurrentSession();
  await changePassword(user._id, await readJson(request), session._id);
  return ok({ message: "Password updated. Other devices have been signed out." });
});
