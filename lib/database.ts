import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
    }

let cashed = global.mongoose;

if (!cashed) {
    cashed = global.mongoose = {conn: null, promise: null}; 
}

export const connectToDatabase = async () => {
    if (cashed.conn) {
        return cashed.conn;
    }

    if (!cashed.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }

        cashed.promise = mongoose
            .connect(MONGO_URI, opts)
            .then(() => mongoose.connection)
            .catch((error) => {
                console.error("Database connection error:", error);
                return Promise.reject(error); // Ensure the error is propagated
            });
    
    }

    try {
        cashed.conn = await cashed.promise;
    } catch (error) {
        cashed.promise = null;
        throw new Error(`Failed to connect to database ${error}`);
    }
 
    return cashed.conn;

}