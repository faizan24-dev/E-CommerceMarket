import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { listSellerBalances, recordPayout } from "@/server/services/payoutService";

/** GET /api/admin/payouts -> { balances } sellers owed money, with their payout details. */
export const GET = apiRoute({ auth: "admin" }, async () => {
  return ok({ balances: await listSellerBalances() });
});

/**
 * POST /api/admin/payouts  { sellerId, reference, note? } -> 201 { payout }
 * Call after sending the transfer: settles all of that seller's unpaid earnings.
 */
export const POST = apiRoute({ auth: "admin" }, async ({ request, user }) => {
  return ok({ payout: await recordPayout(user, await readJson(request)) }, 201);
});
