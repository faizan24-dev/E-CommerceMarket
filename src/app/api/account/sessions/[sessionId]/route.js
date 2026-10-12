import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";
import { assertObjectId } from "@/server/validators/parse";
import { revokeSession } from "@/server/services/sessionService";

/** DELETE /api/account/sessions/:sessionId -> signs out one device. */
export const DELETE = apiRoute({ auth: "user" }, async ({ params, user }) => {
  await revokeSession(user._id, assertObjectId(params.sessionId, "session"));
  return ok();
});
