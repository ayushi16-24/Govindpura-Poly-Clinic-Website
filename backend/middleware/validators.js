import { body } from "express-validator";

const phoneRule = (field = "phone") =>
  body(field)
    .trim()
    .customSanitizer((v) => String(v).replace(/[\s-]/g, ""))
    .matches(/^(\+91)?[6-9]\d{9}$/)
    .withMessage("Valid 10-digit mobile number daalein");

export const loginRules = [
  body("email").trim().isEmail().withMessage("Valid email daalein"),
  body("password").notEmpty().withMessage("Password zaroori hai"),
];

export const appointmentRules = [
  body("patientName").trim().isLength({ min: 2, max: 80 }).withMessage("Naam 2 se 80 characters ka hona chahiye"),
  phoneRule(),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Valid email daalein"),
  body("doctor").optional({ values: "falsy" }).isMongoId().withMessage("Invalid doctor"),
  body("service").optional({ values: "falsy" }).isMongoId().withMessage("Invalid service"),
  body("date")
    .isISO8601()
    .withMessage("Valid date daalein")
    .custom((value) => {
      const picked = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (picked < today) throw new Error("Date aaj ya aage ki honi chahiye");
      return true;
    }),
  body("timeSlot").trim().notEmpty().withMessage("Time slot chunein").isLength({ max: 40 }),
  body("message").optional({ values: "falsy" }).trim().isLength({ max: 500 }).withMessage("Message 500 characters tak"),
];

export const appointmentStatusRules = [
  body("status")
    .isIn(["Pending", "Confirmed", "Completed", "Cancelled"])
    .withMessage("Status Pending, Confirmed, Completed ya Cancelled hona chahiye"),
];

export const enquiryRules = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Naam 2 se 80 characters ka hona chahiye"),
  phoneRule(),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Valid email daalein"),
  body("message").trim().isLength({ min: 5, max: 1000 }).withMessage("Message 5 se 1000 characters ka hona chahiye"),
];

export const reviewRules = [
  body("patientName").trim().isLength({ min: 2, max: 80 }).withMessage("Naam 2 se 80 characters ka hona chahiye"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating 1 se 5 ke beech honi chahiye"),
  body("comment").trim().isLength({ min: 5, max: 600 }).withMessage("Comment 5 se 600 characters ka hona chahiye"),
];

export const doctorRules = [
  body("name").trim().notEmpty().withMessage("Doctor ka naam zaroori hai"),
  body("specialization").trim().notEmpty().withMessage("Specialization zaroori hai"),
  body("experience").optional({ values: "falsy" }).isInt({ min: 0, max: 70 }).withMessage("Experience 0-70 years"),
  body("photo").optional({ values: "falsy" }).trim().isURL().withMessage("Photo ek valid URL honi chahiye"),
];

export const serviceRules = [
  body("title").trim().notEmpty().withMessage("Service ka title zaroori hai"),
  body("description").trim().notEmpty().withMessage("Description zaroori hai"),
  body("image").optional({ values: "falsy" }).trim().isURL().withMessage("Image ek valid URL honi chahiye"),
];

export const galleryRules = [
  body("imageUrl").trim().isURL().withMessage("Image ek valid URL honi chahiye"),
  body("caption").optional({ values: "falsy" }).trim().isLength({ max: 120 }),
];
