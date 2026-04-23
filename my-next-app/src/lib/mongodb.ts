import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
import dns from "dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;