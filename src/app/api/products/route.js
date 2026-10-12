import { getCategory } from "@/config/categories";
import { UPLOAD_LIMITS } from "@/config/marketplace";
import { apiRoute } from "@/server/http/apiRoute";
import { readFormData } from "@/server/http/request";
import { ok } from "@/server/http/response";
import { createProduct, listPublishedProducts, PRODUCT_SORT_OPTIONS } from "@/server/services/productService";
import { parsePagination, readParam } from "@/server/validators/parse";

/**
 * GET /api/products?q=&category=&sort=&page=&limit= -> published products.
 * Used by the header search suggestions; `limit` is capped at 24.
 */
export const GET = apiRoute({ rateLimit: "search" }, async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const limit = Math.min(24, Math.max(1, Number.parseInt(readParam(params, "limit"), 10) || 12));
  const sort = readParam(params, "sort");
  const result = await listPublishedProducts({
    q: readParam(params, "q"),
    category: getCategory(readParam(params, "category"))?.slug ?? "",
    sort: PRODUCT_SORT_OPTIONS.includes(sort) ? sort : "newest",
    ...parsePagination(params, { limit }),
  });
  return ok(result);
});

const MAX_UPLOAD_BYTES = UPLOAD_LIMITS.productFile.maxBytes + UPLOAD_LIMITS.coverImage.maxBytes + 64 * 1024;

/** POST /api/products (multipart: fields + `cover` + `file`) -> 201 { product }. Sellers and admins. */
export const POST = apiRoute({ auth: "seller", rateLimit: "upload" }, async ({ request, user }) => {
  const formData = await readFormData(request, MAX_UPLOAD_BYTES);
  return ok({ product: await createProduct(user, formData) }, 201);
});
