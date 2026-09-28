import { registerUser } from "@/controllers/authController";
import { apiHandler } from "@/utils/apiHandler";

// POST /api/auth/signup
export const POST = apiHandler(registerUser);
