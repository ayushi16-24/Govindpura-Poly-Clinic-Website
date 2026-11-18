import mongoose from "mongoose";
import SiteContent from "../models/SiteContent.js";
import pick from "../utils/pick.js";

const FIELDS = [
  "clinicName", "tagline", "heroTitle", "heroSubtitle", "aboutText", "address",
  "phone", "email", "whatsapp", "timings", "mapEmbedUrl", "mapLink",
];

const DEFAULT_CONTENT = {
  key: "main",
  clinicName: "Govindpura Poly Clinic",
  tagline: "Your Health, Our Priority",
  heroTitle: "Aapki sehat, hamari zimmedari",
  heroSubtitle: "Jhotwara, Jaipur mein aapke parivaar ki care ke liye.",
  aboutText: "Welcome to our clinic in Jhotwara, Jaipur. Our team is here to help you and your family with everyday healthcare, planned visits and follow-up care, in a warm and respectful environment.",
  address: "Jhotwara, Jaipur",
  phone: "+91 98765 43210",
  email: "info@govindpuraclinic.com",
  timings: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: 9:00 AM - 1:00 PM",
  mapEmbedUrl: "",
  mapLink: "",
};

// Content document nahi hai to defaults ke saath bana deta hai
const getOrCreate = async () => {
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_CONTENT;
  }
  return SiteContent.findOneAndUpdate({ key: "main" }, { $setOnInsert: { key: "main" } }, { new: true, upsert: true });
};

// Public: GET /api/content
export const getContent = async (req, res) => {
  res.json({ success: true, data: await getOrCreate() });
};

// Admin: PUT /api/admin/content
export const updateContent = async (req, res) => {
  await getOrCreate();
  const content = await SiteContent.findOneAndUpdate({ key: "main" }, pick(req.body, FIELDS), {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: content });
};
