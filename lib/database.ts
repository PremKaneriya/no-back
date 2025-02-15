import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// Use global cache to prevent reconnecting on each request
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        console.log("Connecting to MongoDB...");
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false, // Improves performance
            maxPoolSize: 10, // Limits connection pool size for efficiency
        })
        .then(m => {
            console.log("Connected to MongoDB!");
            return m.connection;
        })
        .catch(error => {
            console.error("Database connection error:", error.message);
            return Promise.reject(error);
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error: any) {
        cached.promise = null;
        throw new Error(`Failed to connect to database: ${error.message}`);
    }

    return cached.conn;
};

// Store cached connection globally
(global as any).mongoose = cached;
