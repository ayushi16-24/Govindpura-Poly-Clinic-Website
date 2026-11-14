import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Email ya password galat hai");
  }
  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
};

// GET /api/auth/me
export const me = async (req, res) => {
  const { _id, name, email } = req.admin;
  res.json({ success: true, admin: { id: _id, name, email } });
};
