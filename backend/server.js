import dotenv from "dotenv";
dotenv.config(); // sabse pehle, taaki baaki files ko env mile

import app from "./app.js";
import connectDB from "./config/db.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error("JWT_SECRET .env mein set karein (kam se kam 16 characters ka random string).");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
