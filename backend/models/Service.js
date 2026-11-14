import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Service ka title zaroori hai"], trim: true },
    description: { type: String, required: [true, "Description zaroori hai"], trim: true },
    icon: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
