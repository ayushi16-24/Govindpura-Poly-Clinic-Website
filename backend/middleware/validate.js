import { validationResult } from "express-validator";

// Validation rules ke baad chalta hai; errors ho to 400 return karta hai
export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  res.status(400);
  const message = result
    .array()
    .map((e) => e.msg)
    .join(", ");
  throw new Error(message);
};
