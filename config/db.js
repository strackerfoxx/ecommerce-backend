import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });


export default async function connectDB() {
    try {
        await mongoose.connect( process.env.DB_URL );
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}