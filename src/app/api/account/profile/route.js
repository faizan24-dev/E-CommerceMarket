import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { updateProfile } from "@/server/services/userService";

/** PATCH /api/account/profile  { name } -> { user } */
export const PATCH = apiRoute({ auth: "user" }, async ({ request, user }) => {
  return ok({ user: await updateProfile(user._id, await readJson(request)) });
});
