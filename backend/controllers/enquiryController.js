import Enquiry from "../models/Enquiry.js";
import pick from "../utils/pick.js";

// Public: POST /api/enquiries
export const createEnquiry = async (req, res) => {
  await Enquiry.create(pick(req.body, ["name", "phone", "email", "message"]));
  res.status(201).json({
    success: true,
    message: "Aapki enquiry mil gayi. Hum jaldi sampark karenge.",
  });
};

export const getEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, data: enquiries });
};

export const markEnquiryRead = async (req, res) => {
  const isRead = req.body.isRead === undefined ? true : Boolean(req.body.isRead);
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry nahi mili");
  }
  res.json({ success: true, data: enquiry });
};

export const deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry nahi mili");
  }
  res.json({ success: true, message: "Enquiry delete ho gayi" });
};
