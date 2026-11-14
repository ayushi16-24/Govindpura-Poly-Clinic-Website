import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";
import pick from "../utils/pick.js";

// Public: POST /api/appointments
export const createAppointment = async (req, res) => {
  const data = pick(req.body, ["patientName", "phone", "email", "doctor", "service", "date", "timeSlot", "message"]);
  if (!data.doctor) delete data.doctor;
  if (!data.service) delete data.service;

  if (data.doctor && !(await Doctor.exists({ _id: data.doctor, isActive: true }))) {
    res.status(400);
    throw new Error("Chuna hua doctor available nahi hai");
  }
  if (data.service && !(await Service.exists({ _id: data.service, isActive: true }))) {
    res.status(400);
    throw new Error("Chuni hui service available nahi hai");
  }

  const appointment = await Appointment.create(data);
  res.status(201).json({
    success: true,
    message: "Appointment request mil gayi. Clinic aapse jaldi sampark karega.",
    data: { id: appointment._id, status: appointment.status },
  });
};

// Admin: GET /api/admin/appointments?status=Pending
export const getAppointments = async (req, res) => {
  const filter = {};
  if (["Pending", "Confirmed", "Completed", "Cancelled"].includes(req.query.status)) {
    filter.status = req.query.status;
  }
  const appointments = await Appointment.find(filter)
    .populate("doctor", "name specialization")
    .populate("service", "title")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: appointments });
};

// Admin: PATCH /api/admin/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  )
    .populate("doctor", "name specialization")
    .populate("service", "title");
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment nahi mili");
  }
  res.json({ success: true, data: appointment });
};

export const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment nahi mili");
  }
  res.json({ success: true, message: "Appointment delete ho gayi" });
};
