import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: [true, "Patient ka naam zaroori hai"], trim: true },
    phone: { type: String, required: [true, "Phone zaroori hai"], trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    date: { type: Date, required: [true, "Date zaroori hai"] },
    timeSlot: { type: String, required: [true, "Time slot zaroori hai"], trim: true },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
