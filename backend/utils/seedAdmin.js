// Usage: npm run seed:admin
// .env ke ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD se pehla admin banata hai.
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL aur ADMIN_PASSWORD .env mein set karein.");
    process.exit(1);
  }
  await connectDB();
  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log("Is email ka admin pehle se exist karta hai. Kuch nahi badla.");
  } else {
    await Admin.create({ name: ADMIN_NAME || "Clinic Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log(`Admin ban gaya: ${ADMIN_EMAIL}`);
  }
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
