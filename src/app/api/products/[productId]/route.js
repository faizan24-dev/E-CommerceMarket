import { UPLOAD_LIMITS } from "@/config/marketplace";
import { apiRoute } from "@/server/http/apiRoute";
import { readFormData } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { archiveProduct, getManagedProduct, updateProduct } from "@/server/services/productService";

const MAX_UPLOAD_BYTES = UPLOAD_LIMITS.productFile.maxBytes + UPLOAD_LIMITS.coverImage.maxBytes + 64 * 1024;

/** GET /api/products/:productId -> { product } for its seller or an admin. */
export const GET = apiRoute({ auth: "seller" }, async ({ params, user }) => {
  return ok({ product: await getManagedProduct(user, params.productId) });
});

/** PATCH /api/products/:productId (multipart; `cover` and `file` optional) -> { product } */
export const PATCH = apiRoute({ auth: "seller", rateLimit: "upload" }, async ({ request, params, user }) => {
  const formData = await readFormData(request, MAX_UPLOAD_BYTES);
  return ok({ product: await updateProduct(user, params.productId, formData) });
});

/** DELETE /api/products/:productId -> archives the product (buyers keep their downloads). */
export const DELETE = apiRoute({ auth: "seller" }, async ({ params, user }) => {
  return ok({ product: await archiveProduct(user, params.productId) });
});
