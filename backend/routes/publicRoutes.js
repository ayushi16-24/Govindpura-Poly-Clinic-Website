import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import { appointmentRules, enquiryRules, reviewRules } from "../middleware/validators.js";
import { getPublicDoctors } from "../controllers/doctorController.js";
import { getPublicServices } from "../controllers/serviceController.js";
import { createAppointment } from "../controllers/appointmentController.js";
import { createEnquiry } from "../controllers/enquiryController.js";
import { getPublicReviews, createReview } from "../controllers/reviewController.js";
import { getGallery } from "../controllers/galleryController.js";
import { getContent } from "../controllers/contentController.js";

const router = Router();

// Spam se bachne ke liye: ek IP se 15 min mein max 20 form submissions
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Bahut zyada requests. Thodi der baad try karein." },
});

router.get("/doctors", getPublicDoctors);
router.get("/services", getPublicServices);
router.get("/reviews", getPublicReviews);
router.get("/gallery", getGallery);
router.get("/content", getContent);

router.post("/appointments", formLimiter, appointmentRules, validate, createAppointment);
router.post("/enquiries", formLimiter, enquiryRules, validate, createEnquiry);
router.post("/reviews", formLimiter, reviewRules, validate, createReview);

export default router;
