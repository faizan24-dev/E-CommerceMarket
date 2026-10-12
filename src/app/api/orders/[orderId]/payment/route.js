import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { submitPaymentReference } from "@/server/services/orderService";

/** POST /api/orders/:orderId/payment  { reference } -> { order } now awaiting admin confirmation. */
export const POST = apiRoute({ auth: "user" }, async ({ request, params, user }) => {
  return ok({ order: await submitPaymentReference(user, params.orderId, await readJson(request)) });
});
