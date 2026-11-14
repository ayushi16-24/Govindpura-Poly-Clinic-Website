import mongoose from "mongoose";

// Poori website ke liye sirf EK document (key = "main") rakhte hain
const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    clinicName: { type: String, default: "Govindpura Poly Clinic", trim: true },
    tagline: { type: String, default: "", trim: true },
    heroTitle: { type: String, default: "Aapki sehat, hamari zimmedari", trim: true },
    heroSubtitle: {
      type: String,
      default: "Jhotwara, Jaipur mein aapke parivaar ki care ke liye.",
      trim: true,
    },
    aboutText: { type: String, default: "", trim: true },
    address: { type: String, default: "Jhotwara, Jaipur", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    timings: { type: String, default: "", trim: true },
    mapEmbedUrl: { type: String, default: "", trim: true },
    mapLink: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("SiteContent", siteContentSchema);
