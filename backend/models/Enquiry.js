import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Naam zaroori hai"], trim: true },
    phone: { type: String, required: [true, "Phone zaroori hai"], trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    message: { type: String, required: [true, "Message zaroori hai"], trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
