import { extendCurrentSession } from "@/server/auth/session";
import { toUserDTO } from "@/server/dto";
import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";
import { getOwnedProductIds } from "@/server/services/orderService";

/**
 * GET /api/auth/me -> { user, ownedProductIds } (user is null when signed out).
 * Also slides the session expiry forward, so active users stay signed in.
 */
export const GET = apiRoute({ auth: "optional" }, async ({ user }) => {
  if (!user) return ok({ user: null, ownedProductIds: [] });
  await extendCurrentSession();
  return ok({ user: toUserDTO(user), ownedProductIds: await getOwnedProductIds(user._id) });
});
