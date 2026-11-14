import Doctor from "../models/Doctor.js";
import pick from "../utils/pick.js";

const FIELDS = ["name", "specialization", "qualification", "experience", "photo", "availability", "bio", "isActive"];

// Public: GET /api/doctors
export const getPublicDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isActive: true }).sort({ createdAt: 1 });
  res.json({ success: true, data: doctors });
};

// Admin: GET /api/admin/doctors
export const getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json({ success: true, data: doctors });
};

export const createDoctor = async (req, res) => {
  const doctor = await Doctor.create(pick(req.body, FIELDS));
  res.status(201).json({ success: true, data: doctor });
};

export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor nahi mila");
  }
  res.json({ success: true, data: doctor });
};

export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor nahi mila");
  }
  res.json({ success: true, message: "Doctor delete ho gaya" });
};
