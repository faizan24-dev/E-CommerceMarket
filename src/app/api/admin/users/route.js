import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";
import { listUsers } from "@/server/services/userService";
import { parsePagination, readParam } from "@/server/validators/parse";

/** GET /api/admin/users?q=&filter=all|admins|sellers|suspended&page= -> { users, total, page, pageCount } */
export const GET = apiRoute({ auth: "admin" }, async ({ request }) => {
  const params = new URL(request.url).searchParams;
  return ok(await listUsers({ q: readParam(params, "q"), filter: readParam(params, "filter"), ...parsePagination(params, { limit: 25 }) }));
});
