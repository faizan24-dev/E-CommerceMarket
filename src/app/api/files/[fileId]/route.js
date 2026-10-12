import { apiRoute } from "@/server/http/apiRoute";
import { getPublicFile } from "@/server/services/fileService";

/**
 * GET /api/files/:fileId -> a public file (product cover images).
 * File ids never change content, so responses are cached for a year.
 */
export const GET = apiRoute(async ({ params }) => {
  const file = await getPublicFile(params.fileId);
  return new Response(file.stream, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
});
