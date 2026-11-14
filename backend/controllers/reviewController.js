import Review from "../models/Review.js";
import pick from "../utils/pick.js";

// Public: GET /api/reviews  (sirf approved)
export const getPublicReviews = async (req, res) => {
  const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};

// Public: POST /api/reviews  (admin approve kare tab tak hidden)
export const createReview = async (req, res) => {
  await Review.create({ ...pick(req.body, ["patientName", "rating", "comment"]), isApproved: false });
  res.status(201).json({
    success: true,
    message: "Review ke liye shukriya! Approval ke baad ye website par dikhega.",
  });
};

export const getAllReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};

export const setReviewApproval = async (req, res) => {
  const isApproved = req.body.isApproved === undefined ? true : Boolean(req.body.isApproved);
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
  if (!review) {
    res.status(404);
    throw new Error("Review nahi mila");
  }
  res.json({ success: true, data: review });
};

export const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review nahi mila");
  }
  res.json({ success: true, message: "Review delete ho gaya" });
};
