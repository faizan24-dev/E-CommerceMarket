import { apiRoute } from "@/server/http/apiRoute";
import { ok } from "@/server/http/response";

/**
 * GET /api/health
 * Also connects to the database, so after deploying you can open this URL to
 * confirm the environment variables and MongoDB Atlas access are correct.
 */
export const GET = apiRoute(async () => ok({ message: "Ecommerce Market API is running.", database: "connected" }));
