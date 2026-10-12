import { apiRoute } from "@/server/http/apiRoute";
import { readJson } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { moderateProduct } from "@/server/services/productService";

/**
 * PATCH /api/admin/products/:productId
 * { action: "approve" | "reject" | "unpublish" | "feature" | "unfeature", note? } -> { product }
 */
export const PATCH = apiRoute({ auth: "admin" }, async ({ request, params, user }) => {
  return ok({ product: await moderateProduct(user, params.productId, await readJson(request)) });
});
