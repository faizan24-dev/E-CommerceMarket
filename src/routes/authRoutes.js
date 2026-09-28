import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
