import mongoose from "mongoose";

/**
 * Connects to MongoDB. Exits the process if the initial connection fails,
 * since the API cannot serve any auth request without a database.
 */
export default async function connectDB() {
  mongoose.connection.on("disconnected", () => console.warn("[db] MongoDB disconnected"));
  mongoose.connection.on("reconnected", () => console.log("[db] MongoDB reconnected"));
  mongoose.connection.on("error", (error) => console.error(`[db] MongoDB error: ${error.message}`));

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[db] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}
