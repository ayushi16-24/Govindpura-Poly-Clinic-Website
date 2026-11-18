import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "GovindpuraClinic_2026_SecureKey_91x7p";
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  connectDB().catch((err) => {
    console.error(`Database connection issue: ${err.message}`);
  });
});
