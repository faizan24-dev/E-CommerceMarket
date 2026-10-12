import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { getPayoutMethod, setPayoutMethod } from "@/server/services/sellerService";

/** GET /api/seller/payout-method -> { payoutMethod } with the account number masked. */
export const GET = apiRoute({ auth: "seller" }, async ({ user }) => {
  return ok({ payoutMethod: await getPayoutMethod(user._id) });
});

/** PUT /api/seller/payout-method  { type, accountHolder, provider, accountNumber, notes } */
export const PUT = apiRoute({ auth: "seller", rateLimit: "password" }, async ({ request, user }) => {
  return ok({ payoutMethod: await setPayoutMethod(user._id, await readJson(request)) });
});
