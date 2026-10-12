import { toUserDTO } from "@/server/dto";
import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { registerUser } from "@/server/services/authService";

/** POST /api/auth/signup  { name, email, password } -> 201 { user }. The user logs in next. */
export const POST = apiRoute({ rateLimit: "signup" }, async ({ request }) => {
  const user = await registerUser(await readJson(request));
  return ok({ user: toUserDTO(user.toObject()) }, 201);
});
