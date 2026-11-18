import mongoose from "mongoose";

// MongoDB se connect karta hai
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI .env file ya environment variables mein set nahi hai.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;
