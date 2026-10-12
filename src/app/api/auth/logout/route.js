import { destroyCurrentSession } from "@/server/auth/session";
import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";

/** POST /api/auth/logout -> ends this session and clears the cookie. */
export const POST = apiRoute(async () => {
  await destroyCurrentSession();
  return ok();
});
