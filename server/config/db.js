import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
    return conn;
  } catch (error) {
    console.warn("⚠️ MongoDB connection warning:", error.message);
    // Don't exit, allow server to run without DB
  }
};

export default connectDB;
