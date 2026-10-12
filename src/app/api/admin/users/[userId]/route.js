import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { assertObjectId } from "@/server/validators/parse";
import { updateUserAsAdmin } from "@/server/services/userService";

/** PATCH /api/admin/users/:userId  { role?, status?, sellerStatus? } -> { user } */
export const PATCH = apiRoute({ auth: "admin" }, async ({ request, params, user }) => {
  const userId = assertObjectId(params.userId, "user");
  return ok({ user: await updateUserAsAdmin(user, userId, await readJson(request)) });
});
