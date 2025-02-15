import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Ensures efficient connection pooling
        };

        cached.promise = mongoose
            .connect(MONGO_URI, opts)
            .then(m => m.connection)
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

(global as any).mongoose = cached;
