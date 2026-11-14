import SiteContent from "../models/SiteContent.js";
import pick from "../utils/pick.js";

const FIELDS = [
  "clinicName", "tagline", "heroTitle", "heroSubtitle", "aboutText", "address",
  "phone", "email", "whatsapp", "timings", "mapEmbedUrl", "mapLink",
];

// Content document nahi hai to defaults ke saath bana deta hai
const getOrCreate = () =>
  SiteContent.findOneAndUpdate({ key: "main" }, { $setOnInsert: { key: "main" } }, { new: true, upsert: true });

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
