import { apiRoute } from "@/server/http/apiRoute";
import { getProductDownload } from "@/server/services/fileService";

/**
 * GET /api/downloads/:productId -> the product file as an attachment.
 * Only for buyers with a paid order, the product's seller, and admins.
 */
export const GET = apiRoute({ auth: "user", rateLimit: "download" }, async ({ params, user }) => {
  const file = await getProductDownload(user, params.productId);
  return new Response(file.stream, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${file.filename}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
});
