import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  appointmentStatusRules,
  doctorRules,
  serviceRules,
  galleryRules,
} from "../middleware/validators.js";
import { getStats } from "../controllers/statsController.js";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";
import { getAllServices, createService, updateService, deleteService } from "../controllers/serviceController.js";
import { getEnquiries, markEnquiryRead, deleteEnquiry } from "../controllers/enquiryController.js";
import { getAllReviews, setReviewApproval, deleteReview } from "../controllers/reviewController.js";
import { createGalleryImage, deleteGalleryImage } from "../controllers/galleryController.js";
import { updateContent } from "../controllers/contentController.js";

const router = Router();

// Is file ke SAARE routes login (JWT) mangte hain
router.use(protect);

router.get("/stats", getStats);

router.get("/appointments", getAppointments);
router.patch("/appointments/:id/status", appointmentStatusRules, validate, updateAppointmentStatus);
router.delete("/appointments/:id", deleteAppointment);

router.get("/doctors", getAllDoctors);
router.post("/doctors", doctorRules, validate, createDoctor);
router.put("/doctors/:id", doctorRules, validate, updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

router.get("/services", getAllServices);
router.post("/services", serviceRules, validate, createService);
router.put("/services/:id", serviceRules, validate, updateService);
router.delete("/services/:id", deleteService);

router.get("/enquiries", getEnquiries);
router.patch("/enquiries/:id/read", markEnquiryRead);
router.delete("/enquiries/:id", deleteEnquiry);

router.get("/reviews", getAllReviews);
router.patch("/reviews/:id/approval", setReviewApproval);
router.delete("/reviews/:id", deleteReview);

router.post("/gallery", galleryRules, validate, createGalleryImage);
router.delete("/gallery/:id", deleteGalleryImage);

router.put("/content", updateContent);

export default router;
