import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Render jaise proxy ke peeche real client IP (rate-limit ke liye) chahiye
app.set("trust proxy", 1);

// CLIENT_URL mein comma se alag karke ek se zyada origins de sakte hain
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // origin undefined = Postman/curl jaisi tools; allow
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("CORS: ye origin allowed nahi hai"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Govindpura Poly Clinic API chal rahi hai" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

// Hamesha routes ke baad aur sabse aakhir mein
app.use(notFound);
app.use(errorHandler);

export default app;
