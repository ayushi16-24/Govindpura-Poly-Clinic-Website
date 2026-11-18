import mongoose from "mongoose";
import GalleryImage from "../models/GalleryImage.js";
import pick from "../utils/pick.js";

export const getGallery = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, data: [] });
  }
  const images = await GalleryImage.find().sort({ createdAt: -1 });
  res.json({ success: true, data: images });
};

export const createGalleryImage = async (req, res) => {
  const image = await GalleryImage.create(pick(req.body, ["imageUrl", "caption"]));
  res.status(201).json({ success: true, data: image });
};

export const deleteGalleryImage = async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image nahi mili");
  }
  res.json({ success: true, message: "Image delete ho gayi" });
};
