import mongoose from "mongoose";
import { getEnv } from "./config/env.js";
import { AppError } from "./errors.js";

/*
 * On Vercel every API route runs as a serverless function, and a warm function
 * is reused for many requests. Caching the connection on globalThis lets those
 * requests share one MongoDB connection instead of opening a new one each time
 * (it also survives hot reloads in development).
 */
const cached = (globalThis.__mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const { MONGO_URI, DB_NAME } = getEnv();

  cached.promise ??= mongoose
    .connect(MONGO_URI, {
      dbName: DB_NAME || undefined,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    })
    .then((instance) => {
      console.log(`[db] connected: ${instance.connection.host}/${instance.connection.name}`);
      return instance;
    });

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // let the next request retry
    console.error(`[db] connection failed: ${error.message}`);
    throw new AppError(
      503,
      "Could not connect to the database. Check MONGO_URI and MongoDB Atlas Network Access.",
    );
  }
  return cached.conn;
}

export async function disconnectDB() {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}
