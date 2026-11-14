// OPTIONAL: sirf design preview ke liye NAKLI sample data daalta hai.
//   npm run seed:sample          -> sample data add
//   npm run seed:sample:remove   -> sample data hata do
// Har sample record ke naam mein "[SAMPLE]" likha hota hai.
// Real website publish karne se pehle ise zaroor remove karein.
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";
import Review from "../models/Review.js";

const TAG = "[SAMPLE]";
const remove = process.argv.includes("--remove");

const run = async () => {
  await connectDB();
  const re = /^\[SAMPLE\]/;
  if (remove) {
    const d = await Doctor.deleteMany({ name: re });
    const s = await Service.deleteMany({ title: re });
    const r = await Review.deleteMany({ patientName: re });
    console.log(`Removed: ${d.deletedCount} doctors, ${s.deletedCount} services, ${r.deletedCount} reviews`);
  } else {
    await Doctor.create([
      { name: `${TAG} Doctor Name 1`, specialization: "Specialization yahan likhein", qualification: "Qualification yahan likhein", experience: 0, availability: "Timing yahan likhein" },
      { name: `${TAG} Doctor Name 2`, specialization: "Specialization yahan likhein", qualification: "Qualification yahan likhein", experience: 0, availability: "Timing yahan likhein" },
    ]);
    await Service.create([
      { title: `${TAG} Service 1`, description: "Ye sirf design preview ke liye sample text hai. Asli service admin dashboard se add karein.", icon: "+" },
      { title: `${TAG} Service 2`, description: "Ye sirf design preview ke liye sample text hai. Asli service admin dashboard se add karein.", icon: "+" },
      { title: `${TAG} Service 3`, description: "Ye sirf design preview ke liye sample text hai. Asli service admin dashboard se add karein.", icon: "+" },
    ]);
    await Review.create([
      { patientName: `${TAG} Patient`, rating: 5, comment: "Ye sirf design preview ke liye sample review hai.", isApproved: true },
    ]);
    console.log("Sample data add ho gaya. Publish se pehle `npm run seed:sample:remove` chalayein.");
  }
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
