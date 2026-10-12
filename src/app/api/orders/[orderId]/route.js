import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { getOrderForViewer, updateOrderStatus } from "@/server/services/orderService";

/** GET /api/orders/:orderId -> { order } for its buyer or an admin. */
export const GET = apiRoute({ auth: "user" }, async ({ params, user }) => {
  return ok({ order: await getOrderForViewer(user, params.orderId) });
});

/**
 * PATCH /api/orders/:orderId  { action: "confirm" | "cancel", reason? } -> { order }
 * "confirm" (admin only) marks a manual payment as received and unlocks downloads.
 * "cancel" works for admins, and for buyers on their own unpaid orders.
 */
export const PATCH = apiRoute({ auth: "user" }, async ({ request, params, user }) => {
  return ok({ order: await updateOrderStatus(user, params.orderId, await readJson(request)) });
});
