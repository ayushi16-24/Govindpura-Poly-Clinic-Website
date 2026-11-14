import mongoose from "mongoose";

// MongoDB se connect karta hai. Fail hone par server band ho jata hai.
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI .env file mein set nahi hai.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
