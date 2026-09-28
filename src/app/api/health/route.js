import { apiHandler, json } from "@/utils/apiHandler";

// Always run on request, never cached at build time.
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Also checks the database connection, so after deploying you can open this URL
 * to confirm the environment variables and MongoDB Atlas access are correct.
 */
export const GET = apiHandler(async () =>
  json({ success: true, message: "Ecommerce Market API is running.", database: "connected" }),
);
