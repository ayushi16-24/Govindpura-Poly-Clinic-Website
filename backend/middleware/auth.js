import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Protected routes ke liye: Authorization: Bearer <token> check karta hai
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Login zaroori hai (token nahi mila)");
  }
  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    res.status(401);
    throw new Error("Admin account nahi mila");
  }
  req.admin = admin;
  next();
};
