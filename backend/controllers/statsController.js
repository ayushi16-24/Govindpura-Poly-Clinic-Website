import Appointment from "../models/Appointment.js";
import Enquiry from "../models/Enquiry.js";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";
import Review from "../models/Review.js";

// Admin: GET /api/admin/stats  (dashboard ke counts)
export const getStats = async (req, res) => {
  const [appointments, pending, enquiries, unread, doctors, services, pendingReviews] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "Pending" }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ isRead: false }),
    Doctor.countDocuments(),
    Service.countDocuments(),
    Review.countDocuments({ isApproved: false }),
  ]);
  res.json({
    success: true,
    data: { appointments, pending, enquiries, unread, doctors, services, pendingReviews },
  });
};
