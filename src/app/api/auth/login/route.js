import { loginUser } from "@/controllers/authController";
import { apiHandler } from "@/utils/apiHandler";

// POST /api/auth/login
export const POST = apiHandler(loginUser);
