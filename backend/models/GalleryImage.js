import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: [true, "Image URL zaroori hai"], trim: true },
    caption: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryImage", galleryImageSchema);
