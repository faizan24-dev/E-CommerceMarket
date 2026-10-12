import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { checkout, listBuyerOrders } from "@/server/services/orderService";
import { parsePagination } from "@/server/validators/parse";

/** GET /api/orders?page= -> the signed-in buyer's orders. */
export const GET = apiRoute({ auth: "user" }, async ({ request, user }) => {
  const params = new URL(request.url).searchParams;
  return ok(await listBuyerOrders(user._id, parsePagination(params)));
});

/** POST /api/orders  { productIds } -> 201 { order }. Prices are always taken from the database. */
export const POST = apiRoute({ auth: "user", rateLimit: "checkout" }, async ({ request, user }) => {
  return ok({ order: await checkout(user, await readJson(request)) }, 201);
});
