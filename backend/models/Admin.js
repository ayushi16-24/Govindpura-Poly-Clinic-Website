import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Naam zaroori hai"], trim: true },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [8, "Password kam se kam 8 characters ka ho"],
      select: false, // query mein by default password nahi aata
    },
  },
  { timestamps: true }
);

// Save se pehle password hash karo (sirf jab change hua ho)
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Admin", adminSchema);
