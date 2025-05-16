import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Validate Environment Variables
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
    console.error("❌ MongoDB URI is missing in environment variables.");
    process.exit(1); // Exit the application if the URI is not provided
}

// MongoDB Connection Function
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI); // No need for deprecated options
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(`Error: ${error.message}`);
        process.exit(1); // Graceful termination in case of a fatal error
    }
};

export default connectDB;
