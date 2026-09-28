import { getMe } from "@/controllers/authController";
import { apiHandler } from "@/utils/apiHandler";

// GET /api/auth/me (requires Authorization: Bearer <token>)
export const GET = apiHandler(getMe);
