import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

/*
 * On Vercel every API route runs as a serverless function, and a warm function
 * is reused for many requests. Caching the connection on globalThis lets those
 * requests share one MongoDB connection instead of opening a new one each time.
 */
const cached = (globalThis.__mongoose ??= { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    console.error("[db] MONGO_URI is not set");
    throw new ApiError(500, "Server is not configured: MONGO_URI environment variable is missing.");
  }

  cached.promise ??= mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || undefined,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    })
    .then((instance) => {
      console.log(`[db] MongoDB connected: ${instance.connection.host}/${instance.connection.name}`);
      return instance;
    });

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // allow the next request to retry
    console.error(`[db] MongoDB connection failed: ${error.message}`);
    throw new ApiError(
      500,
      "Could not connect to the database. Check MONGO_URI and MongoDB Atlas Network Access.",
    );
  }
  return cached.conn;
}
