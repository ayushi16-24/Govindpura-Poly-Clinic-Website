import mongoose from "mongoose";
import Service from "../models/Service.js";
import pick from "../utils/pick.js";

const FIELDS = ["title", "description", "icon", "image", "isActive"];

export const getPublicServices = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, data: [] });
  }
  const services = await Service.find({ isActive: true }).sort({ createdAt: 1 });
  res.json({ success: true, data: services });
};

export const getAllServices = async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ success: true, data: services });
};

export const createService = async (req, res) => {
  const service = await Service.create(pick(req.body, FIELDS));
  res.status(201).json({ success: true, data: service });
};

export const updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error("Service nahi mili");
  }
  res.json({ success: true, data: service });
};

export const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service nahi mili");
  }
  res.json({ success: true, message: "Service delete ho gayi" });
};
