import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../frontend/dist");

const app = express();

// Render jaise proxy ke peeche real client IP (rate-limit ke liye) chahiye
app.set("trust proxy", 1);

// CLIENT_URL mein comma se alag karke ek se zyada origins de sakte hain
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isOriginAllowed = (origin, host) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const originUrl = new URL(origin);
    if (
      originUrl.host === host ||
      originUrl.hostname === "localhost" ||
      originUrl.hostname === "127.0.0.1" ||
      originUrl.hostname.endsWith(".onrender.com") ||
      originUrl.hostname.endsWith(".railway.app") ||
      originUrl.hostname.endsWith(".vercel.app")
    ) {
      return true;
    }
  } catch {}
  return false;
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors((req, callback) => {
    const origin = req.header("Origin");
    const allowed = isOriginAllowed(origin, req.headers.host);
    callback(null, { origin: allowed, credentials: true });
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

// Production: serve built frontend from single service
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      // Missing static files with file extensions should 404, not return index.html
      if (path.extname(req.path)) {
        return res.status(404).json({ success: false, message: "Asset not found" });
      }
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}

// Hamesha routes ke baad aur sabse aakhir mein
app.use(notFound);
app.use(errorHandler);

export default app;
