import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        console.log("🔄 Connecting to MongoDB...");
        cached.promise = mongoose
            .connect(MONGO_URI, {
                maxPoolSize: 10, // Optimized connection pooling
                bufferCommands: false,
            })
            .then((m) => {
                console.log("✅ Connected to MongoDB!");
                return m.connection;
            })
            .catch((error) => {
                console.error("❌ Database connection error:", error.message);
                return Promise.reject(error);
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error: any) {
        cached.promise = null;
        throw new Error(`Database connection failed: ${error.message}`);
    }

    return cached.conn;
};

(global as any).mongoose = cached;
