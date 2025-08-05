import mongoose from "mongoose";

let isConnected = false;

export const connectMongoDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
