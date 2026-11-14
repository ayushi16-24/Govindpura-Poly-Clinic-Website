import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: [true, "Naam zaroori hai"], trim: true },
    rating: { type: Number, required: [true, "Rating zaroori hai"], min: 1, max: 5 },
    comment: { type: String, required: [true, "Comment zaroori hai"], trim: true },
    isApproved: { type: Boolean, default: false }, // admin approve kare tabhi public mein dikhega
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
