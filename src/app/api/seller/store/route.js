import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { becomeSeller, updateStore } from "@/server/services/sellerService";

/** POST /api/seller/store  { storeName, bio } -> 201 { user }. Opens a seller shop. */
export const POST = apiRoute({ auth: "user" }, async ({ request, user }) => {
  return ok({ user: await becomeSeller(user._id, await readJson(request)) }, 201);
});

/** PATCH /api/seller/store  { storeName, bio } -> { user } */
export const PATCH = apiRoute({ auth: "seller" }, async ({ request, user }) => {
  return ok({ user: await updateStore(user._id, await readJson(request)) });
});
