import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;

export const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Your Database is connected successfully");
    } catch (error) {
        console.log("Failed to Connect Database", error);
    }
}