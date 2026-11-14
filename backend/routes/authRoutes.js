import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginRules } from "../middleware/validators.js";

const router = Router();

// Brute-force se bachne ke liye: 15 min mein max 10 login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Bahut zyada login attempts. 15 minute baad try karein." },
});

router.post("/login", loginLimiter, loginRules, validate, login);
router.get("/me", protect, me);

export default router;
