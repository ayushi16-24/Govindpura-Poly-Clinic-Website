import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Doctor ka naam zaroori hai"], trim: true },
    specialization: { type: String, required: [true, "Specialization zaroori hai"], trim: true },
    qualification: { type: String, trim: true, default: "" },
    experience: { type: Number, min: 0, default: 0 },
    photo: { type: String, trim: true, default: "" },
    availability: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
